import { Entity, Column, PrimaryColumn } from 'typeorm';
@Entity()
export class Space {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ nullable: true })
  parentSpaceId: string;

  @Column()
  userId: string;

  @Column()
  urlPath: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  edges: string;

  @Column({ type: 'text' })
  nodes: string;
}
