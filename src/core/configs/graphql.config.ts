import type { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

import { isDev } from '@/src/shared/utils/is-dev.util'

export function graphQLConfig(
	configService: ConfigService
): ApolloDriverConfig {
	return {
		playground: isDev(configService),
		path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
		autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
		sortSchema: true,
		context: ({ req, res }) => ({ req, res }),
		installSubscriptionHandlers: true,
		introspection: true
	}
}
