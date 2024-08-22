import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  token: string

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  password: string
}
