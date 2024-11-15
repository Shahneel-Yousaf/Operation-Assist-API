import { GroupMachineCondition } from '@shared/constants';
import { User } from '@user/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Machine } from '.';

@Entity('machine_conditions')
export class MachineCondition extends BaseEntity {
  @PrimaryColumn({ name: 'machine_id' })
  machineId: string;

  @Column({ name: 'machine_condition' })
  machineCondition: GroupMachineCondition;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => Machine, (machine) => machine.groupMachineCondition)
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  @ManyToOne(() => User, (user) => user.machineConditions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
