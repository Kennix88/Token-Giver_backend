import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule, { rawBody: true })
	await app.listen(3000)
}
bootstrap()
