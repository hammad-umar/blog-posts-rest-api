import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateCategoryDto:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          default: Technology
 *
 *    UpdateCategoryResponseDto:
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
 *
 */
export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string
}
