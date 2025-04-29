import { max } from 'drizzle-orm'
import { channels } from '~~/server/database/schema'

export default defineCachedEventHandler(async () => {
  const drizzle = useDrizzle()
  const maxMembers = await drizzle.select({ value: max(channels.members) }).from(tables.channels)
  return maxMembers[0].value ?? 0
}, {
  maxAge: 60 * 60, // 1 hours,
})
