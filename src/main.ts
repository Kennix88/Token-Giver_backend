import { CoreModule } from '@core/core.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule, { rawBody: true })

	const config = app.get(ConfigService)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
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
