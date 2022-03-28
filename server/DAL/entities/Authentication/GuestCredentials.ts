import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity()
export class GuestCredentials extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	password: string;
}
