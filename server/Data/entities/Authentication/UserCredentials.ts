import {Entity, Column, BaseEntity, PrimaryColumn} from 'typeorm';

@Entity()
export class UserCredentials extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	permissionLevel: number;
}
