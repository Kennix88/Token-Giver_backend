import { Context } from '@integrations/telegram/types/telegrafContext.interface'
import { ConfigService } from '@nestjs/config'
import { PinoLogger } from 'nestjs-pino'
import { Ctx, Start, Update } from 'nestjs-telegraf'

@Update()
export class StartUpdate {
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(StartUpdate.name)
	}

	@Start()
	async startCommand(@Ctx() ctx: Context) {
		try {
			if (ctx.chat?.type !== 'private' || !ctx.from) return

			await ctx.replyWithHTML('started')

			return
		} catch (e) {
			this.logger.error({
				tgUserId: ctx.from?.id,
				msg: `An error occurred when starting the bot`,
				err: e,
			})
		}
	}
}
