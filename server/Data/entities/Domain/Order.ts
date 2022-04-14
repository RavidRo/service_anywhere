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
import {Guest} from './Guest';
import {OrderToItem} from './OrderToItem';
import {Review} from './Review';
import {Waiter} from './Waiter';

@Entity()
export class Order extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	status: string;

	@Column('datetime')
	creationTime: number;

	@Column('datetime', {
		nullable: true,
	})
	completionTime: number;

	@OneToOne(() => Review, {
		nullable: true,
	})
	@JoinColumn()
	review: Review;

	@ManyToOne(() => Guest, guest => guest.orders)
	guest: Guest;

	@OneToMany(() => OrderToItem, orderToItems => orderToItems.order)
	orderToItems: OrderToItem[];

	@ManyToMany(() => Waiter, waiter => waiter.orders)
	@JoinTable()
	waiters: Waiter[];
}
