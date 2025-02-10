import { telegrafConfig } from '@core/configs/telegraf.config'
import { StartUpdate } from '@integrations/telegram/start.update'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'

@Global()
@Module({
	imports: [
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: telegrafConfig,
			inject: [ConfigService],
		}),
	],
	providers: [StartUpdate],
	exports: [],
})
export class TelegramModule {}
