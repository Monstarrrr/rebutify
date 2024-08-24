import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

const TITLE_MAX_LEN = 255

@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 10,
    default: 'ARGUMENT',
  })
  type: 'ARGUMENT' | 'REBUTTAL' | 'COMMENT'

  @Column({ type: 'boolean', default: false })
  isPrivate: boolean

  @Column({ type: 'text' })
  body: string

  @Column({ type: 'varchar', length: TITLE_MAX_LEN })
  title: string

  @Column({ type: 'int', nullable: true })
  ownerUserId: number | null

  @Column({ type: 'int', nullable: true })
  parentId: number | null

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
