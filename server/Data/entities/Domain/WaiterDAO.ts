import {WaiterIDO} from 'api';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	JoinTable,
	ManyToMany,
} from 'typeorm';
import {OrderDAO} from './OrderDAO';

@Entity()
export class WaiterDAO extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@ManyToMany(() => OrderDAO, order => order.waiters)
	@JoinTable()
	orders: OrderDAO[];

	get available(): boolean {
		return this.orders === undefined || this.orders.length === 0;
	}

	getDetails(): WaiterIDO {
		return {available: this.available, id: this.id, name: this.name};
	}
}
