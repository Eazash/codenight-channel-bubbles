export default defineEventHandler(async () => {
  const drizzle = useDrizzle()

  const channels = await drizzle.query.channels.findMany()
  return channels
})
