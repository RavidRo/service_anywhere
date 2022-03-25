import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	JoinColumn,
	OneToOne,
	Relation,
} from 'typeorm';
import {Review} from './Review';

@Entity()
export class Order extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
	status: string;

	@Column()
	creationTime: number;

	@Column()
	completionTime: number;

	@OneToOne(() => Review)
	@JoinColumn()
	review: Relation<Review>;
}
