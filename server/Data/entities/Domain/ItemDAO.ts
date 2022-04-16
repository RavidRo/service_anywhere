import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import {OrderToItemDAO} from './OrderToItemDAO';

@Entity()
export class ItemDAO extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	name: string;

	@Column()
	price: number;

	@Column()
	preparationTime: number;

	@OneToMany(() => OrderToItemDAO, orderToItems => orderToItems.item)
	orderToItems: OrderToItemDAO[];
}
