export function buildGoogleStaticMapUrl (address: string): string {
  if (address === null) return ''
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap'
  const zoom = 15
  const size = '1280x720'
  const scale = 2
  const mapType = 'roadmap'
  const markerColor = 'red'
  const markerSize = 'mid'
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID

  const formattedAddress = address.replace(/\s+/g, '.')

  const url = `${baseUrl}?center=${formattedAddress}&zoom=${zoom}&scale=${scale}&size=${size}&maptype=${mapType}&markers=size:${markerSize}|color:${markerColor}|${formattedAddress}&key=${apiKey}&map_id=${mapId}`

  return url
}
