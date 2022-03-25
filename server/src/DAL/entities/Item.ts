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
export class Item extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	price: number;

	@Column()
	preparationTime: number;
}
