import {OrderIDO, OrderStatus} from 'api';
import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import {GuestDAO} from './GuestDAO';
import {OrderToItemDAO} from './OrderToItemDAO';
import {ReviewDAO} from './ReviewDAO';
import {WaiterDAO} from './WaiterDAO';

@Entity()
export class OrderDAO extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({default: 'received'})
	status: OrderStatus;

	@Column('bigint', {default: () => `${Date.now()}`})
	creationTime: number;

	@Column('bigint', {
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

	getDetails(): OrderIDO {
		const items: [string, number][] = this.orderToItems.map(orderToItem => [
			orderToItem.item.id,
			orderToItem.quantity,
		]);

		// Seems like PostgreSQL is outputting a string but sqlite is outputting a number
		const creationTime =
			typeof this.creationTime === 'string'
				? Number.parseInt(this.creationTime)
				: this.creationTime;

		const completionTime =
			typeof this.completionTime === 'string'
				? Number.parseInt(this.completionTime)
				: this.completionTime;

		return {
			id: this.id,
			guestID: this.guest.id,
			items: Object.fromEntries(items),
			status: this.status,
			creationTime: new Date(creationTime),
			completionTime: completionTime
				? new Date(completionTime)
				: undefined,
			review: this.review ? this.review.getDetails() : undefined,
		};
	}
}
