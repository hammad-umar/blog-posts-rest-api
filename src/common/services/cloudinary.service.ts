import { Express } from 'express'
import { Service } from 'typedi'
import streamifier from 'streamifier'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '../../env'

@Service()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    })
  }

  async upload(file: Express.Multer.File): Promise<UploadApiResponse | undefined> {
    return new Promise((resolve, reject) => {
      const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
        {
          folder: '/blog-posts-api',
        },
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        },
      )

      streamifier.createReadStream(file.buffer).pipe(cloudinaryUploadStream)
    })
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  }
}
