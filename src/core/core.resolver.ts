import { Query, Resolver } from '@nestjs/graphql'

@Resolver('core')
export class CoreResolver {
	@Query(() => String)
	public async hello() {
		return 'hello'
	}
}
