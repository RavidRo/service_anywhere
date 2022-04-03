import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from 'typeorm';
import {Item} from './Item';
import {Order} from './Order';

@Entity()
export class OrderToItem extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	quantity: number;

	@ManyToOne(() => Item, item => item.orderToItems)
	item: Item;

	@ManyToOne(() => Order, order => order.orderToItems)
	order: Order;
}
