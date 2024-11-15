import { OilCoolantRefillExchange } from '@machine-report/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { OilTypeTranslation } from '.';

@Entity('oil_types')
export class OilType extends BaseEntity {
  @PrimaryColumn({ name: 'oil_type_id' })
  oilTypeId: string;

  @Column({ name: 'oil_type_code' })
  oilTypeCode: string;

  @OneToOne(
    () => OilTypeTranslation,
    (oilTypeTranslation) => oilTypeTranslation.oilType,
  )
  @JoinColumn({
    name: 'oil_type_id',
    referencedColumnName: 'oilTypeId',
  })
  oilTypeTranslation: OilTypeTranslation;

  @OneToMany(
    () => OilCoolantRefillExchange,
    (oilCoolantRefillExchange) => oilCoolantRefillExchange.oilType,
  )
  oilCoolantRefillExchanges: OilCoolantRefillExchange[];
}
