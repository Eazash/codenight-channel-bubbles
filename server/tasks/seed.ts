import { createConsola, LogLevels } from 'consola'
import { channels_seed_data } from '~~/server/database/seed/channels'
import { tables, useDrizzle } from '~~/server/utils/drizzle'

const taskName = 'db:seed'

const consola = createConsola({
  level: LogLevels.debug,
}).withTag(taskName)

export default defineTask({
  meta: {
    name: taskName,
    description: 'Seed database with channels',
  },
  async run() {
    const drizzle = useDrizzle()

    consola.log('Seeding database with channels')
    consola.log(`Seeding database with ${channels_seed_data.length} channels`)
    // Batch writes as a workaround for https://github.com/drizzle-team/drizzle-orm/issues/2479
    const chunkSize = 10
    for (let i = 0; i < channels_seed_data.length; i += chunkSize) {
      await drizzle.insert(tables.channels).values(channels_seed_data.slice(i, i + chunkSize).map(channelUsername => ({ channelUsername }))).onConflictDoNothing().returning({ id: tables.channels.id })
    }
    consola.log('Seeding channels complete')
    return {
      result: 'success',
    }
  },
})
