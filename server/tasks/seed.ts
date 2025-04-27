import { createConsola, LogLevels } from 'consola'
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
    const channels = [
      { name: 'Dagmawi Babi', channelUsername: '@Dagmawi_Babi' },
      { name: 'Dave Dumps', channelUsername: '@DaveDumps' },
      { name: 'The Blogrammer', channelUsername: '@the_blogrammer' },
      { name: 'Beka', channelUsername: '@bekacru_c' },
    ]
    consola.log(`Seeding database with ${channels.length} channels`)
    await drizzle.insert(tables.channels).values(channels)
    consola.log('Seeding channels complete')
    return {
      result: 'success',
    }
  },
})
