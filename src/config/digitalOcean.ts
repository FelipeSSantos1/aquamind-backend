import { ConfigService } from '@nestjs/config'

export const SpaceConfig = () => {
  const configService = new ConfigService()
  return {
    accessKeyId: configService.get('DO_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('DO_SECRET_ACCESS_KEY'),
    region: configService.get('DO_REGION'),
    endpoint: configService.get('DO_ENDPOINT_URL')
  }
}
