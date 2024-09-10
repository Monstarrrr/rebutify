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

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  password: string
}
