import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class MapDAO extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	imageURL: string;

	@Column('real')
	topRightLat: number;

	@Column('real')
	topLeftLat: number;

	@Column('real')
	bottomRightLat: number;

	@Column('real')
	bottomLeftLat: number;

	@Column('real')
	topRightLong: number;

	@Column('real')
	topLeftLong: number;

	@Column('real')
	bottomRightLong: number;

	@Column('real')
	bottomLeftLong: number;
}
