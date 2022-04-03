import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	JoinTable,
	ManyToMany,
} from 'typeorm';
import {Order} from './Order';

@Entity()
export class Waiter extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	name: string;

	@ManyToMany(() => Order, order => order.waiters)
	@JoinTable()
	orders: Order[];
}
