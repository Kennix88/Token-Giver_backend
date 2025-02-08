import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaConnectModule } from '@core/prisma/prismaConnect.module'
import { IS_DEV_ENV } from '@shared/utils/is-dev.util'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
		}),
		PrismaConnectModule,
	],
	controllers: [],
	providers: [],
})
export class CoreModule {}
