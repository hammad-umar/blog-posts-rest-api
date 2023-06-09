import { Body, Delete, Get, JsonController, Param, Patch, Post } from 'routing-controllers'
import { Service } from 'typedi'
import { CategoryService } from '../services/category.service'
import { CreateCategoryDto } from '../dtos/category/create-category.dto'
import { UpdateCategoryDto } from '../dtos/category/update-category.dto'

@Service()
@JsonController('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @Get()
  getAllCategories() {
    return this.categoryService.find()
  }

  @Get('/:id')
  getSingleCategory(@Param('id') id: string) {
    return this.categoryService.findOne(id)
  }

  @Patch('/:id')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto)
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.delete(id)
  }
}
