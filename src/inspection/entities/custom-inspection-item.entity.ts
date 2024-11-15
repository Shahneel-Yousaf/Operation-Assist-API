import {
  CustomInspectionFormCurrentStatus,
  CustomInspectionItemResultType,
} from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import {
  CustomInspectionForm,
  CustomInspectionItemHistory,
  CustomInspectionItemMedia,
  InspectionResult,
} from '.';

@Entity('custom_inspection_items')
export class CustomInspectionItem extends BaseEntity {
  @PrimaryColumn({ name: 'custom_inspection_item_id' })
  customInspectionItemId: string;

  @Column({ name: 'custom_inspection_form_id' })
  customInspectionFormId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'result_type' })
  resultType: CustomInspectionItemResultType;

  @Column({ name: 'is_required' })
  isRequired: boolean;

  @Column({ name: 'is_immutable' })
  isImmutable: boolean;

  @Column({ name: 'is_forced_required' })
  isForcedRequired: boolean;

  @Column({ name: 'position' })
  position: number;

  @Column({ name: 'current_status' })
  currentStatus: CustomInspectionFormCurrentStatus;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

  @Column({ name: 'item_code' })
  itemCode: string;

  @ManyToOne(
    () => CustomInspectionForm,
    (customInspectionForm) => customInspectionForm.customInspectionItems,
  )
  @JoinColumn({ name: 'custom_inspection_form_id' })
  customInspectionForm: CustomInspectionForm;

  @OneToMany(
    () => CustomInspectionItemMedia,
    (customInspectionItemMedia) =>
      customInspectionItemMedia.customInspectionItem,
  )
  customInspectionItemMedias: CustomInspectionItemMedia[];

  @OneToMany(
    () => InspectionResult,
    (inspectionResult) => inspectionResult.customInspectionItem,
  )
  inspectionResults: InspectionResult[];

  @OneToMany(
    () => CustomInspectionItemHistory,
    (customInspectionItemHistory) =>
      customInspectionItemHistory.customInspectionItem,
  )
  customInspectionItemHistories: CustomInspectionItemHistory[];
}
