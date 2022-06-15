import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import {ItemDAO} from './ItemDAO';
import {OrderDAO} from './OrderDAO';

@Entity()
export class OrderToItemDAO extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	quantity: number;

	@ManyToOne(() => ItemDAO, item => item.orderToItems)
	item: ItemDAO;

	@ManyToOne(() => OrderDAO, order => order.orderToItems)
	order: OrderDAO;
}
