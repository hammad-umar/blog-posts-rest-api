import request from 'supertest'
import app from '../../server'
import { CreateCategoryDto } from '../../dtos/category/create-category.dto'
import { UpdateCategoryDto } from '../../dtos/category/update-category.dto'

const validId = '42c26670-f7a5-4d20-9466-1a9c81465e08'
const inValidId = '42c26670-f7a5-4d20-9466-1a9c81465e00'

describe('e2e Category', () => {
  describe('GET /api/v1/category', () => {
    it('should return 200 status and list of categories', async () => {
      const res = await request(app).get('/api/v1/category')

      expect(res.statusCode).toEqual(200)
      expect(res.body).toBeDefined()
    })
  })

  describe('GET /api/v1/category/:id', () => {
    it('should return 200 status and category object if valid id is provided', async () => {
      const res = await request(app).get(`/api/v1/category/${validId}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).not.toBeUndefined()
    })

    it('should return 404 status if invalid id is provided', async () => {
      const res = await request(app).get(`/api/v1/category/${inValidId}`)

      expect(res.statusCode).toEqual(404)
      expect(res.body).not.toBeUndefined()
    })
  })

  describe('POST /api/v1/category', () => {
    const createCategoryDto: CreateCategoryDto = {
      title: 'New Category!',
    }

    it('should return 201 status and category object', async () => {
      const res = await request(app).post('/api/v1/category').send(createCategoryDto)

      expect(res.statusCode).toEqual(201)
      expect(res.body).not.toBeUndefined()
    })
  })

  describe('UPDATE /api/v1/category/:id', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      title: 'Updated Category!',
    }

    it('should return 200 status code and updated category object if valid id is provided', async () => {
      const res = await request(app).patch(`/api/v1/category/${validId}`).send(updateCategoryDto)

      expect(res.statusCode).toEqual(200)
      expect(res.body.title).toEqual(updateCategoryDto.title)
    })

    it('should return 404 status code if invalid id is provided', async () => {
      const res = await request(app).patch(`/api/v1/category/${inValidId}`).send(updateCategoryDto)

      expect(res.statusCode).toEqual(404)
    })

    it('should return 400 status code if title is not string', async () => {
      const res = await request(app).patch(`/api/v1/category/${inValidId}`).send({ title: 10 })

      expect(res.statusCode).toEqual(400)
    })
  })

  describe('DELETE /api/v1/category', () => {
    it('should return 200 status code and deleted category object if valid id provided', async () => {
      const res = await request(app).delete(`/api/v1/category/${validId}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toBeDefined()
    })

    it('should return 404 status code if invalid id provided', async () => {
      const res = await request(app).delete(`/api/v1/category/${inValidId}`)

      expect(res.statusCode).toEqual(404)
    })
  })
})
