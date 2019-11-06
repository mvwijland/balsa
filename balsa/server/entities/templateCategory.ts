import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToMany } from 'typeorm';
import { Template } from './template';

@Entity()
export class TemplateCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(type => Template, object => object.categories)
  public templates: Template[];
}
