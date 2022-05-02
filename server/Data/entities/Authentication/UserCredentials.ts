import {Entity, Column, BaseEntity, PrimaryColumn} from 'typeorm';

@Entity()
export class UserCredentials extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	password: string;

	@Column()
	permissionLevel: number;
}
