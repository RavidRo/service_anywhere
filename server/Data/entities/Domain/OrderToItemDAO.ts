import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from 'typeorm';
import {ItemDAO} from './ItemDAO';
import {OrderDAO} from './OrderDAO';

@Entity()
export class OrderToItemDAO extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	quantity: number;

	@ManyToOne(() => ItemDAO, item => item.orderToItems)
	item: ItemDAO;

	@ManyToOne(() => OrderDAO, order => order.orderToItems)
	order: OrderDAO;
}
