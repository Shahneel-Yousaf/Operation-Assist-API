import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { PartReplacement } from '.';

@Entity('part_replacement_medias')
export class PartReplacementMedia extends BaseEntity {
  @PrimaryColumn({ name: 'part_replacement_media_id' })
  partReplacementMediaId: string;

  @Column({ name: 'part_replacement_id' })
  partReplacementId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'media_url' })
  mediaUrl: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(
    () => PartReplacement,
    (partReplacement) => partReplacement.partReplacementMedias,
  )
  @JoinColumn([{ name: 'part_replacement_id' }])
  partReplacement: PartReplacement;
}
