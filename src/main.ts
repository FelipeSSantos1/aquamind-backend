import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import express from 'express'
// import * as bodyParser from 'body-parser'
import helmet from 'helmet'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(
    helmet({
      expectCt: true,
      frameguard: true,
      hsts: true,
      noSniff: true,
      permittedCrossDomainPolicies: true,
      contentSecurityPolicy: false,
      dnsPrefetchControl: false,
      xssFilter: false
    })
  )
  app.use(express.json({ limit: '50mb' }))
  app.enableCors({
    origin: ['http://aquamind.app', 'https://aquamind.app'],
    methods: ['PATCH', 'POST']
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
}
bootstrap()
