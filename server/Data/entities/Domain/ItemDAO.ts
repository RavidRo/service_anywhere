import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import {OrderToItemDAO} from './OrderToItemDAO';

@Entity()
export class ItemDAO extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column('real')
	price: number;

	@Column()
	preparationTime: number;

	@OneToMany(() => OrderToItemDAO, orderToItems => orderToItems.item)
	orderToItems: OrderToItemDAO[];
}
