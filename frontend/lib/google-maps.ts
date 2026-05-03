export function registerGoogleMaps (): void {
  const searchParams = new URLSearchParams({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    callback: 'initMap',
    libraries: 'marker'
  })

  const url = `https://maps.googleapis.com/maps/api/js?${searchParams.toString()}`

  if (document.querySelector(`script[src="${url}"]`) === null) {
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }
}
