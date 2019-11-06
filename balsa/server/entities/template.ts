import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, JoinTable, ManyToMany } from 'typeorm';
import { TemplateCategory } from './templateCategory';

@Entity()
export class Template extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ default: '' })
  public content: string;

  @Column({ default: '' })
  public contentHtml: string;

  @JoinTable()
  @ManyToMany(type => TemplateCategory, category => category.templates)
  public categories: TemplateCategory[];
}
