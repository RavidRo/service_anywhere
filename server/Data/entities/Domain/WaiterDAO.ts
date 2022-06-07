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
	username: string;

	@ManyToMany(() => OrderDAO, order => order.waiters)
	@JoinTable()
	orders: OrderDAO[];

	getDetails(): WaiterIDO {
		return {
			id: this.id,
			username: this.username,
		};
	}
}
