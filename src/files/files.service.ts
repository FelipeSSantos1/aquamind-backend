import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { ConfigService } from '@nestjs/config'
import { v4 as uuid } from 'uuid'

import { Photo } from '../post/dto/post.dto'
import { SpaceConfig } from 'src/config/digitalOcean'

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadTankAvatar(img: string, profileId: number) {
    try {
      const s3 = new S3({ ...SpaceConfig() })
      const dataBuffer = Buffer.from(img, 'base64')

      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('DO_SPACES_NAME'),
          ACL: 'public-read',
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg',
          Body: dataBuffer,
          Key: `avatar/tank/${profileId}/${uuid()}.jpg`
        })
        .promise()

      return uploadResult
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async uploadProfileAvatar(img: string, profileId: number) {
    try {
      const s3 = new S3({ ...SpaceConfig() })
      const dataBuffer = Buffer.from(
        img.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      )

      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('DO_SPACES_NAME'),
          ACL: 'public-read',
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg',
          Body: dataBuffer,
          Key: `avatar/profile/${profileId}/${uuid()}.jpg`
        })
        .promise()

      return uploadResult
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async uploadPostPhotos(photos: Photo[], profileId: number) {
    try {
      const s3 = new S3({ ...SpaceConfig() })

      const uploadResult: Photo[] = []
      for (const photo of photos) {
        const img = Buffer.from(
          photo.image.replace(/^data:image\/\w+;base64,/, ''),
          'base64'
        )
        const result = await s3
          .upload({
            Bucket: this.configService.get('DO_SPACES_NAME'),
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            Body: img,
            Key: `post/${profileId}/${uuid()}.jpg`
          })
          .promise()

        uploadResult.push({
          image: result.Key,
          width: photo.width,
          height: photo.height
        })
      }

      return uploadResult
    } catch (error) {
      console.log({ error })
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
