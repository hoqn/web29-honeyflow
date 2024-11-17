import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { SnowflakeService } from 'src/common/utils/snowflake.service';
@Entity()
export class Space {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

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
