import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
} from 'typeorm';

@Entity()
export class Template extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({default: ''})
  public content: string;
}
