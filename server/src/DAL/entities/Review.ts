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
export class Review extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	rating: number;

	@Column()
	content: string;
}
