import { QueryRunner, TableForeignKey } from 'typeorm';

const createForeignKeys = async (
  foreignKeys: { keys: string[][]; table: string; onDelete?: string }[],
  queryRunner: QueryRunner,
) => {
  for (const foreignKey of foreignKeys) {
    const { keys, table, onDelete } = foreignKey;
    const keyNames = keys.map((key: string[]) => {
      const [columnNames, referencedColumnNames, referencedTableName] = key;
      return new TableForeignKey({
        columnNames: [columnNames],
        referencedColumnNames: [referencedColumnNames],
        referencedTableName: referencedTableName,
        onDelete: onDelete ? onDelete : 'CASCADE',
      });
    });
    await queryRunner.createForeignKeys(table, keyNames);
  }
};

const dropForeignKeys = async (
  foreignKeys: string[][],
  queryRunner: QueryRunner,
) => {
  for (const foreignKey of foreignKeys) {
    const [table, key] = foreignKey;
    await queryRunner.dropForeignKey(table, key);
  }
};

const insertOrUpsertTable = async (
  connection: QueryRunner,
  table: string,
  primaryKeys: string[],
  data: Record<string, any>,
) => {
  const columns = Object.keys(data[0]);
  const values = data
    .map((item) => {
      const objectValues = Object.values(item)
        .map((val) => (typeof val === 'string' ? `N'${val}'` : val))
        .map((val) => (val === null ? `null` : val))
        .join(',');
      return `(${objectValues})`;
    })
    .join(',');

  const valueColumn = columns.map((column) => `s.${column}`);
  const valueUpdate = columns.map((column) => `${column} = s.${column}`);
  const condition = primaryKeys.map(
    (primaryKey) => `t.${primaryKey} = s.${primaryKey}`,
  );

  await connection.manager.queryRunner.query(`
    MERGE INTO ${table} as t
    USING (VALUES ${values}) AS s(${columns.join()})
    ON ${condition.join(' AND ')}
    WHEN MATCHED THEN
      UPDATE SET ${valueUpdate.join()}
    WHEN NOT MATCHED THEN
      INSERT (${columns.join()}) VALUES (${valueColumn.join()});
  `);
};

export { createForeignKeys, dropForeignKeys, insertOrUpsertTable };
