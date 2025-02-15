import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { TelegramModule } from '@/src/integrations/telegram/telegram.module'
import { graphQLConfig } from '@core/configs/graphql.config'
import { pinoConfig } from '@core/configs/pino.config'
import { CoreResolver } from '@core/core.resolver'
import { PrismaConnectModule } from '@core/prisma/prismaConnect.module'
import { RedisModule } from '@core/redis/redis.module'
import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { IS_DEV_ENV } from '@shared/utils/is-dev.util'
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nJsonLoader,
	I18nModule,
	QueryResolver,
} from 'nestjs-i18n'
import { LoggerModule } from 'nestjs-pino'

@Module({
	imports: [
		LoggerModule.forRoot(pinoConfig),
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
		I18nModule.forRootAsync({
			useFactory: () => ({
				disableMiddleware: true,
				fallbackLanguage: 'en',
				loaderOptions: {
					path: 'src/core/i18n/locales',
					watch: true,
					includeSubfolders: true,
				},
				typesOutputPath: 'src/core/i18n/i18n.type.ts',
			}),
			resolvers: [
				{ use: QueryResolver, options: ['lang'] },
				AcceptLanguageResolver,
				new HeaderResolver(['x-lang']),
			],
			loader: I18nJsonLoader,
		}),
		PrismaConnectModule,
		RedisModule,
		TelegramModule,
	],
	controllers: [],
	providers: [CoreResolver],
})
export class CoreModule {}
