import {OrderStatus} from 'api';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	JoinColumn,
	OneToOne,
	ManyToOne,
	JoinTable,
	ManyToMany,
	OneToMany,
} from 'typeorm';
import {GuestDAO} from './GuestDAO';
import {OrderToItemDAO} from './OrderToItemDAO';
import {ReviewDAO} from './ReviewDAO';
import {WaiterDAO} from './WaiterDAO';

@Entity()
export class OrderDAO extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({default: 'received'})
	status: OrderStatus;

	@Column('datetime', {default: () => Date.now()})
	creationTime: number;

	@Column('datetime', {
		nullable: true,
	})
	completionTime?: number;

	@OneToOne(() => ReviewDAO, {
		nullable: true,
	})
	@JoinColumn()
	review: ReviewDAO;

	@ManyToOne(() => GuestDAO, guest => guest.orders)
	guest: GuestDAO;

	@OneToMany(() => OrderToItemDAO, orderToItems => orderToItems.order)
	orderToItems: OrderToItemDAO[];

	@ManyToMany(() => WaiterDAO, waiter => waiter.orders)
	@JoinTable()
	waiters: WaiterDAO[];
}
