import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnCategoryDto } from './dto/return-category.dto';
import { ProductsService } from './../products/products.service';
import { CountProductByCategoryDto } from './../products/dto/count-product-by-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.findOneByName(createCategoryDto.name).catch(
      () => undefined,
    );

    if (category) {
      throw new BadRequestException('Category already exists');
    }

    return await this.categoryRepository.save(
      this.categoryRepository.create(createCategoryDto),
    );
  }

  async findAll(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryRepository.find();

    const quantityProdutsByCategory =
      await this.productsService.countProductsByCategory();

    return categories.map(
      (category) =>
        new ReturnCategoryDto(
          category,
          this.findQuantityProductsByCategory(
            category,
            quantityProdutsByCategory,
          ),
        ),
    );
  }

  findQuantityProductsByCategory(
    category: Category,
    countList: CountProductByCategoryDto[],
  ): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id,
    );

    return count ? count.total : 0;
  }

  async findOne(id: number, isRelations?: boolean): Promise<Category> {
    try {
      return await this.categoryRepository.findOneOrFail({
        where: { id },
        relations: {
          products: isRelations ? true : false,
        },
      });
    } catch (error) {
      throw new NotFoundException('Category not found');
    }
  }

  async findOneByName(name: string): Promise<Category> {
    try {
      return await this.categoryRepository.findOneByOrFail({ name });
    } catch (error) {
      throw new NotFoundException('Category not found');
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    return await this.categoryRepository.save({
      ...category,
      ...updateCategoryDto,
    });
  }

  async remove(id: number): Promise<DeleteResult> {
    const category = await this.findOne(id, true);

    if (category.products?.length > 0) {
      throw new BadRequestException(
        'it is not possible to delete a category with products',
      );
    }

    return await this.categoryRepository.delete(id);
  }
}
