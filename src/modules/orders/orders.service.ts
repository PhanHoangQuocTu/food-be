import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from 'src/entities/orders-products.entity';
import { ShippingEntity } from 'src/entities/shipping.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrdersProductsEntity)
    private readonly ordersProductRepository: Repository<OrdersProductsEntity>,

    private readonly productService: ProductsService
  ) { }

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    const shippingEntity = new ShippingEntity();

    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();

    orderEntity.shippingAddress = shippingEntity;

    orderEntity.user = currentUser;

    const orderTbl = await this.orderRepository.save(orderEntity);

    const ordersProductsEntity: {
      order: OrderEntity;
      product: ProductEntity;
      product_unit_price: number;
      product_quantity: number;
    }[] = []

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;

      const product = await this.productService.findOne(createOrderDto.orderedProducts[i].id);

      const product_quantity = createOrderDto.orderedProducts[i].product_quanity;

      const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;

      ordersProductsEntity.push({ order, product, product_unit_price, product_quantity })
    }

    await this.ordersProductRepository.createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(ordersProductsEntity)
      .execute()

    return await this.findOne(orderTbl.id);
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
