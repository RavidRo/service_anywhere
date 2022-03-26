import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity()
export class Review extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	rating: number;

	@Column('text')
	content: string;
}
