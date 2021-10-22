import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { ConfigService } from '@nestjs/config'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'

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

  async uploadPostPhotos(img: string[], profileId: number) {
    try {
      const s3 = new S3({ ...SpaceConfig() })

      const dataBuffer = _.map(img, (image) =>
        Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
      )

      const uploadResult: string[] = []
      for (const image of dataBuffer) {
        const result = await s3
          .upload({
            Bucket: this.configService.get('DO_SPACES_NAME'),
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            Body: image,
            Key: `post/${profileId}/${uuid()}.jpg`
          })
          .promise()

        uploadResult.push(result.Key)
      }

      return uploadResult
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
