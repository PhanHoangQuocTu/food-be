import { CategoriesService } from './../categories/categories.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,

    private readonly categoriesService: CategoriesService
  ) { }

  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    const category = await this.categoriesService.findOne(+createProductDto.categoryId);

    const product = this.productsRepository.create(createProductDto);

    product.category = category;

    product.addedBy = currentUser;

    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { addedBy: true, category: true },
      select: {
        addedBy: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          address: true
        },
        category: {
          id: true,
          title: true
        }
      }
    });

    if (!product) throw new NotFoundException('Product not found');

    return product
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    product.addedBy = currentUser;

    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOne(+updateProductDto.categoryId);

      product.category = category;
    }

    return await this.productsRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
