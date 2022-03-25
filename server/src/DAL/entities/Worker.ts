import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	JoinColumn,
	OneToOne,
	Relation,
} from 'typeorm';

@Entity()
export class Worker extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;
}
