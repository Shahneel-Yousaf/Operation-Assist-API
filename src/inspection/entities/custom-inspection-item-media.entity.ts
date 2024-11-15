import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { CustomInspectionItem } from '.';

@Entity('custom_inspection_item_medias')
export class CustomInspectionItemMedia extends BaseEntity {
  @PrimaryColumn({ name: 'custom_inspection_item_media_id' })
  customInspectionItemMediaId: string;

  @Column({ name: 'custom_inspection_item_id' })
  customInspectionItemId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'media_url' })
  mediaUrl: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(
    () => CustomInspectionItem,
    (customInspectionItem) => customInspectionItem.customInspectionItemMedias,
  )
  @JoinColumn({ name: 'custom_inspection_item_id' })
  customInspectionItem: CustomInspectionItem;
}
