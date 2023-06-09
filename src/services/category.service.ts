import { Category, PrismaClient } from '@prisma/client'
import { Inject, Service } from 'typedi'
import { constants } from '../constants'
import { CreateCategoryDto } from '../dtos/category/create-category.dto'
import { UpdateCategoryDto } from '../dtos/category/update-category.dto'
import { NotFoundError } from 'routing-controllers'

@Service()
export class CategoryService {
  constructor(@Inject(constants.PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async find(): Promise<Category[]> {
    return this.prisma.category.findMany()
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } })

    if (!category) {
      throw new NotFoundError('Category not found!')
    }

    return category
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
      },
    })
  }

  async delete(id: string): Promise<Category> {
    await this.findOne(id)

    return this.prisma.category.delete({ where: { id } })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.findOne(id)

    return await this.prisma.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
      },
    })
  }
}
