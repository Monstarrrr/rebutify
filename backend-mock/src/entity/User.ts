import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  refreshToken: string | null

  @Column({ nullable: true })
  accessToken: string | null

  @Column({ nullable: true })
  verified: boolean = false

  @Column({ nullable: true })
  upvotedPosts: string | null = '' // SQLite does not support arrays & objects

  @Column({ nullable: true })
  downvotedPosts: string | null = '' // SQLite does not support arrays & objects

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  password: string
}
