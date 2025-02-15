import { I18nTranslations } from '@core/i18n/i18n.type'
import { Context } from '@integrations/telegram/types/telegrafContext.interface'
import { ConfigService } from '@nestjs/config'
import { I18nService } from 'nestjs-i18n'
import { PinoLogger } from 'nestjs-pino'
import { Ctx, Start, Update } from 'nestjs-telegraf'

@Update()
export class StartUpdate {
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: PinoLogger,
		private readonly i18n: I18nService<I18nTranslations>,
	) {
		this.logger.setContext(StartUpdate.name)
	}

	@Start()
	async startCommand(@Ctx() ctx: Context) {
		try {
			if (ctx.chat?.type !== 'private' || !ctx.from) return

			await ctx.replyWithHTML(
				this.i18n.t('telegraf.start.welcome', {
					...(ctx.from.language_code && { lang: ctx.from.language_code }),
				}),
			)

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
