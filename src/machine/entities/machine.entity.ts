import { Group } from '@group/entities';
import {
  CustomInspectionForm,
  CustomInspectionFormHistory,
  Inspection,
} from '@inspection/entities';
import { MachineReport, MachineReportHistory } from '@machine-report/entities';
import { MachineCurrentStatus } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import {
  MachineCondition,
  MachineHistory,
  MachineManufacturer,
  MachineType,
  UserGroupMachineFavorite,
} from '.';

@Entity('machines')
export class Machine extends BaseEntity {
  @PrimaryColumn({ name: 'machine_id' })
  machineId: string;

  @Column({ name: 'customer_machine_name' })
  machineName: string;

  @Column({ name: 'machine_type_id' })
  machineTypeId: string;

  @Column({ name: 'picture_url' })
  pictureUrl: string;

  @Column({ name: 'machine_manufacturer_id' })
  machineManufacturerId: string;

  @Column({ name: 'model_and_type' })
  modelAndType: string;

  @Column({ name: 'serial_number' })
  serialNumber: string;

  @Column({ name: 'serial_number_plate_picture_url' })
  serialNumberPlatePictureUrl: string;

  @Column({ name: 'current_status' })
  currentStatus: MachineCurrentStatus;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

  @Column({ name: 'custom_machine_manufacturer_name' })
  customMachineManufacturerName: string;

  @Column({ name: 'custom_type_name' })
  customTypeName: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'last_service_meter' })
  lastServiceMeter: string;

  @Column({ name: 'last_service_meter_updated_at' })
  lastServiceMeterUpdatedAt: Date;

  @ManyToOne(() => MachineType, (machineType) => machineType.machines)
  @JoinColumn({ name: 'machine_type_id' })
  machineType: MachineType;

  @ManyToOne(
    () => MachineManufacturer,
    (machineManufacturer) => machineManufacturer.machines,
  )
  @JoinColumn({ name: 'machine_manufacturer_id' })
  machineManufacturer: MachineManufacturer;

  @OneToMany(
    () => UserGroupMachineFavorite,
    (userGroupMachineFavorite) => userGroupMachineFavorite.machine,
  )
  userGroupMachineFavorites: UserGroupMachineFavorite[];

  @OneToOne(
    () => MachineCondition,
    (machineCondition) => machineCondition.machine,
  )
  groupMachineCondition: MachineCondition;

  @ManyToOne(() => Group, (group) => group.userGroupAssignments)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToMany(() => MachineReport, (machineReport) => machineReport.machine)
  machineReports: MachineReport[];

  @OneToMany(() => MachineHistory, (machineHistory) => machineHistory.machine)
  machineHistories: MachineHistory[];

  @OneToMany(
    () => CustomInspectionForm,
    (customInspectionForm) => customInspectionForm.machine,
  )
  customInspectionForms: CustomInspectionForm[];

  @OneToMany(() => Inspection, (inspection) => inspection.machine)
  inspections: Inspection[];

  @OneToMany(
    () => CustomInspectionFormHistory,
    (customInspectionFormHistory) => customInspectionFormHistory.machine,
  )
  customInspectionFormHistories: CustomInspectionFormHistory[];

  @OneToMany(
    () => MachineReportHistory,
    (machineReportHistory) => machineReportHistory.machine,
  )
  machineReportHistories: MachineReportHistory[];
}
