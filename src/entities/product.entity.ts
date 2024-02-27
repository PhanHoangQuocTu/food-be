import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./category.entity";
import { ReviewEntity } from "./review.entity";

@Entity('products')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
    })
    price: number;

    @Column()
    stock: number;

    @Column('simple-array')
    images: string[];

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne(() => UserEntity, (user) => user.products)
    addedBy: UserEntity;

    @ManyToOne(() => CategoryEntity, (category) => category.products)
    category: CategoryEntity;

    @OneToMany(() => ReviewEntity, (review) => review.product)
    reviews: ReviewEntity[];
}
