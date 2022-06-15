import {
	BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';
import { OrderDAO } from './OrderDAO';

@Entity()
export class GuestDAO extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	phoneNumber: string;

	@Column()
	username: string;

	@OneToMany(() => OrderDAO, order => order.guest)
	orders: OrderDAO[];
}
