import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity()
export class WorkerCredentials extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	password: string;
}
