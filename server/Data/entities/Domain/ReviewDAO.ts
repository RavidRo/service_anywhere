import { ReviewIDO } from 'api';
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

	getDetails(): ReviewIDO {
		return {details: this.content, rating: this.rating}
	}
}
