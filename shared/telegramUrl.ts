export function useTelegramURL() {
  const config = useRuntimeConfig()
  const url = config.botUrl + config.botToken

  return url
}
