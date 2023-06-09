import { IsNotEmpty, IsString } from 'class-validator'

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateCategoryDto:
 *      type: object
 *      required:
 *        - title
 *      properties:
 *        title:
 *          type: string
 *          default: Technology
 *
 *    CreateCategoryResponseDto:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        title:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string
}
