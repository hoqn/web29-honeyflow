import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Space {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  edges: string;

  @Column({ type: 'text' })
  nodes: string;
}
