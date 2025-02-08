import { CoreModule } from '@core/core.module'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule, { rawBody: true })

	const config = app.get(ConfigService)

	await app.listen(3000)
}
bootstrap()
