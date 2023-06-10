import { Body, Delete, Get, JsonController, Param, Patch, Post, HttpCode } from 'routing-controllers'
import { Service } from 'typedi'
import { CategoryService } from '../services/category.service'
import { CreateCategoryDto } from '../dtos/category/create-category.dto'
import { UpdateCategoryDto } from '../dtos/category/update-category.dto'

@Service()
@JsonController('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * @openapi
   * '/api/v1/category':
   *  post:
   *    tags:
   *      - Category
   *    summary: Create a new category.
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateCategoryDto'
   *    responses:
   *      201:
   *        description: Get list of categories
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateCategoryResponseDto'
   */
  @Post()
  @HttpCode(201)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  /**
   * @openapi
   * '/api/v1/category':
   *  get:
   *    tags:
   *      - Category
   *    summary: Get list of all categories.
   *    responses:
   *      200:
   *        description: Successfully returns list of all categories.
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                allOf:
   *                  - $ref: '#/components/schemas/CreateCategoryResponseDto'
   */
  @Get()
  getAllCategories() {
    return this.categoryService.find()
  }

  /**
   * @openapi
   * '/api/v1/category/{id}':
   *  get:
   *    tags:
   *      - Category
   *    summary: Get single category by id.
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: string
   *        description: The category id.
   *    responses:
   *      200:
   *        description: The detail of the category.
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateCategoryResponseDto'
   *      404:
   *        description: Category not found.
   */
  @Get('/:id')
  getSingleCategory(@Param('id') id: string) {
    return this.categoryService.findOne(id)
  }

  /**
   * @openapi
   * '/api/v1/category/{id}':
   *  patch:
   *    tags:
   *      - Category
   *    summary: Update category by id.
   *    requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/UpdateCategoryDto'
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: string
   *        description: The category id.
   *    responses:
   *      200:
   *        description: Update an existing category by id.
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UpdateCategoryResponseDto'
   *      404:
   *        description: Category not found.
   */
  @Patch('/:id')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto)
  }

  /**
   * @openapi
   * '/api/v1/category/{id}':
   *  delete:
   *    tags:
   *      - Category
   *    summary: Delete category by id.
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: string
   *        description: The category id.
   *    responses:
   *      200:
   *        description: Successfully deleted the category by it's id.
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateCategoryResponseDto'
   *      404:
   *        description: Category not found.
   */
  @Delete('/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.delete(id)
  }
}
