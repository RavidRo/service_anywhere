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
export class Guest extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	phoneNumber: string;

	@Column()
	name: string;
}
