import { Injectable } from '@nestjs/common';
import { Permission } from '@user-group-role-template/entities';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(private dataSource: DataSource) {
    super(Permission, dataSource.createEntityManager());
  }

  async getPermissionByIds(permissionIds: string[]): Promise<Permission[]> {
    return this.find({
      where: {
        permissionId: In(permissionIds),
      },
    });
  }

  async getPermissionByResourceAndOperation(
    operationCode: string,
    resourceCode: string,
  ): Promise<Permission> {
    return this.findOne({
      where: {
        operation: {
          operationCode,
        },
        resource: {
          resourceCode,
        },
      },
      relations: ['operation', 'resource'],
    });
  }
}
