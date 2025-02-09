import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { graphQLConfig } from '@core/configs/graphql.config'
import { CoreResolver } from '@core/core.resolver'
import { PrismaConnectModule } from '@core/prisma/prismaConnect.module'
import { RedisModule } from '@core/redis/redis.module'
import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { IS_DEV_ENV } from '@shared/utils/is-dev.util'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: graphQLConfig,
			inject: [ConfigService],
		}),
		PrismaConnectModule,
		RedisModule,
	],
	controllers: [],
	providers: [CoreResolver],
})
export class CoreModule {}
