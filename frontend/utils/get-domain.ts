export function getDomain (url: string): string {
  const withoutProtocol = url.replace(/^https?:\/\/(www\.)?/, '')
  return withoutProtocol.split('/')[0]
}
