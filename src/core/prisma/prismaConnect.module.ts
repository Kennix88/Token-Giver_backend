import { PrismaConnectService } from '@core/prisma/prismaConnect.service'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma'

@Global()
@Module({
	imports: [
		PrismaModule.forRootAsync({
			isGlobal: true,
			useFactory: (config: ConfigService) => ({
				prismaOptions: {
					...config.get('prismaOptions'),
					datasources: {
						db: {
							url: config.getOrThrow('POSTGRES_URI'),
						},
					},
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [PrismaConnectService],
	exports: [PrismaConnectService],
})
export class PrismaConnectModule {}
