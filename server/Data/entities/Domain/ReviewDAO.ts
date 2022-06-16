import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { OrderDAO } from './OrderDAO';

@Entity()
export class ReviewDAO extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	rating: number;

	@Column('text')
	content: string;

	@OneToOne(() => OrderDAO, {
		nullable: false,
	})
	@JoinColumn()
	order: OrderDAO
}
