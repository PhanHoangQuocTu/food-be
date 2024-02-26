import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto, currentUser: UserEntity): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    return await this.categoriesRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesRepository.find();
  }

  async findOne(id: number): Promise<CategoryEntity> {
    return await this.categoriesRepository.findOne({
      where: { id }, relations: { addedBy: true }, select: {
        addedBy: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          address: true,
        }
      }
    });
  }

  async update(id: number, fields: Partial<UpdateCategoryDto>): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, fields);
    return await this.categoriesRepository.save(category);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
