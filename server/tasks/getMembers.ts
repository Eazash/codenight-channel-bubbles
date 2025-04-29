import { createConsola, LogLevels } from 'consola'
import { joinURL } from 'ufo'
import { useTelegramURL } from '~~/shared/telegramUrl'

const taskName = 'channel:getMembers'

const consola = createConsola({
  level: LogLevels.debug,
}).withTag(taskName)
export default defineTask({
  meta: {
    name: 'channel:getMembers',
    description: 'Get Channel Descriptions',
  },
  async run() {
    const telegramUrl = useTelegramURL()
    const drizzle = useDrizzle()
    const channels = await drizzle.query.channels.findMany({
      columns: {
        name: true,
        channelUsername: true,
        chatId: true,
        id: true,
        members: true,
      },
    })
    for (const channel of channels) {
      const response = await $fetch<{ ok: boolean, result?: number | null }>(joinURL(telegramUrl, 'getChatMemberCount'), {
        query: {
          chat_id: channel.chatId || channel.channelUsername,
        },
      })
      consola.log({ chat_id: channel.chatId || channel.channelUsername, members: response.result })
      if (response.ok && response.result) {
        await drizzle.update(tables.channels).set({ members: response.result, updatedAt: new Date() }).where(eq(tables.channels.id, channel.id))
        channel.members = response.result
      }
    }
    return {
      result: 'success',
      data: { channels },
    }
  },
})
