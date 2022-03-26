import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import {OrderToItem} from './OrderToItem';

@Entity()
export class Item extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	name: string;

	@Column()
	price: number;

	@Column()
	preparationTime: number;

	@OneToMany(() => OrderToItem, orderToItems => orderToItems.item)
	orderToItems: OrderToItem[];
}
