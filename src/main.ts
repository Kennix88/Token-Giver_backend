import { CoreModule } from '@core/core.module'
import { RedisService } from '@core/redis/redis.service'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { ms, type StringValue } from '@shared/utils/ms.util'
import { parseBoolean } from '@shared/utils/parse-boolean.util'
import RedisStore from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule, { rawBody: true })

	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	const grapgqlUpload = graphqlUploadExpress({
		maxFileSize: 1000000,
		maxFiles: 10,
	})

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
	app.use(config.getOrThrow<string>('GRAPHQL_PREFIX'), grapgqlUpload)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	)

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				sameSite: 'lax',
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
			}),
		}),
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})
	await app.listen(config.getOrThrow<number>('APPLICATION_PORT') || 3000)
}
bootstrap()
