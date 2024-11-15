import { User } from '@user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('user_ciam_links')
export class UserCiamLink extends BaseEntity {
  @PrimaryColumn({ name: 'user_ciam_link_id' })
  userCiamLinkId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'oid' })
  oid: string;

  @Column({ name: 'iss' })
  iss: string;

  @Column({ name: 'linked_at' })
  linkedAt: Date;

  @Column({ name: 'ciam_email' })
  ciamEmail: string;

  @ManyToOne(() => User, (user) => user.userCiamLinks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
