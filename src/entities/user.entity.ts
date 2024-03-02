import { Roles } from "src/utils/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { CategoryEntity } from "./category.entity";
import { ProductEntity } from "./product.entity";
import { ReviewEntity } from "./review.entity";
import { OrderEntity } from "./order.entity";

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phoneNumber: string;

    @Column()
    address: string;

    @Column({ select: false })
    password: string;

    @Column({ type: "enum", enum: Roles, array: true, default: [Roles.USER] })
    roles: Roles[]

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToMany(() => CategoryEntity, (category) => category.addedBy)
    categories: CategoryEntity[]

    @OneToMany(() => ProductEntity, (product) => product.addedBy)
    products: ProductEntity[]

    @OneToMany(() => ReviewEntity, (review) => review.user)
    reviews: ReviewEntity[]

    @OneToMany(() => OrderEntity, (order) => order.updatedBy)
    ordersUpdateBy: OrderEntity[]

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders: OrderEntity[]
}
