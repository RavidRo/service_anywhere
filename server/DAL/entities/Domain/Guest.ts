import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import {Order} from './Order';

@Entity()
export class Guest extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	phoneNumber: string;

	@Column()
	name: string;

	@OneToMany(() => Order, order => order.guest)
	orders: Order[];
}
