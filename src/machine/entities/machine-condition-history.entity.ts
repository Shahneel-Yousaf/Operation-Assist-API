import { EventType, GroupMachineCondition } from '@shared/constants';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('machine_condition_histories')
export class MachineConditionHistory extends BaseEntity {
  @PrimaryColumn({ name: 'machine_condition_history_id' })
  machineConditionHistoryId: string;

  @Column({ name: 'event_type' })
  eventType: EventType;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'machine_id' })
  machineId: string;

  @Column({ name: 'machine_condition' })
  machineCondition: GroupMachineCondition;
}
