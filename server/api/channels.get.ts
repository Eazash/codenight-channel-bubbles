export default defineCachedEventHandler(async () => {
  const drizzle = useDrizzle()

  const channels = await drizzle.query.channels.findMany()
  return channels
}, {
  maxAge: 60 * 60, // 1 hours,
})
