import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity()
export class UserCredentials extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	password: string;

	@Column()
	permissionLevel: number;
}
