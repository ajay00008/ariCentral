'use client'

import * as React from 'react'
import { registerGoogleMaps } from '@/lib/google-maps'

interface Props {
  address: string
  isBrochure?: boolean
}

declare global {
  interface Window {
    initMap: () => unknown
  }
}

export function Map ({ address, isBrochure }: Props): React.ReactNode {
  const mapRef = React.useRef<HTMLDivElement | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  if (address === null || address === undefined || address === '') {
    return
  }

  React.useEffect(() => {
    function initMap (): void {
      if (mapRef.current === null) {
        return
      }

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 16,
        center: { lat: 0, lng: 0 },
        disableDefaultUI: true,
        zoomControl: true,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID
      })

      const geocoder = new window.google.maps.Geocoder()

      void geocoder.geocode({ address }, (results, status) => {
        if (status !== 'OK' || results === null) {
          setError(
            'Unable to determine latitude and longitude for the address provided.'
          )
          return
        }

        const location = results[0].geometry.location
        const parser = new DOMParser()

        const pinSvgString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="32" viewBox="0 0 20 32">
<title>mapMarker</title>
<path fill="#ec7425" d="M20.033 10.286c0 7.926-9.991 18.377-9.991 18.377s-9.991-10.451-9.991-18.377c0-2.557 0.975-5.114 2.926-7.065s4.508-2.926 7.065-2.926c2.557 0 5.114 0.975 7.065 2.926s2.926 4.508 2.926 7.065z"></path>
<path fill="#dbdcdd" d="M10.041 31.77c2.45 0 4.436-0.379 4.436-0.846s-1.986-0.846-4.436-0.846c-2.45 0-4.436 0.379-4.436 0.846s1.986 0.846 4.436 0.846z"></path>
<path fill="#fff" d="M10.041 15.342c2.792 0 5.056-2.264 5.056-5.056s-2.264-5.056-5.056-5.056c-2.792 0-5.056 2.264-5.056 5.056s2.264 5.056 5.056 5.056z"></path>
</svg>`

        const pinSvg = parser.parseFromString(
          pinSvgString,
          'image/svg+xml'
        ).documentElement

        void new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: location,
          content: pinSvg
        })

        map.setCenter(location)
      })
    }

    if (window.google === undefined) {
      registerGoogleMaps()
      window.initMap = initMap
    } else {
      initMap()
    }
  }, [address])

  return isBrochure !== undefined && isBrochure
    ? (
      <section id='map' className='mx-auto mb-[25px]'>
        <div className='flex flex-col w-full h-auto'>
          <div ref={mapRef} id='map-screenshot' className='w-full h-[170px]' />
        </div>
      </section>
      )
    : (
      <section
        id='map'
        className='smobile:py-[32px] smobile:px-[16px] tablet:px-[32px] laptop:p-[64px] laptop:py-[64px] max-w-[2000px] w-full mx-auto'
      >
        <div className='smobile:flex smobile:flex-col laptop:flex-row w-full h-auto laptop:justify-between'>
          <div className='w-full smobile:h-auto laptop:w-[15%] laptop:flex laptop:flex-col laptop:h-auto laptop:justify-between'>
            <h2 className='smobile:text-[24px] smobile:leading-[1] smobile:font-mundialRegular smobile:mb-[39px] desktop:text-[32px]'>
              Map
            </h2>
            <p className='smobile:hidden smobile:h-0 laptop:flex laptop:h-auto laptop:text-[16px] laptop:leading-[1] laptop:font-mundialLight smobile:whitespace-pre-line'>
              {address}
            </p>
          </div>
          {error !== null
            ? (
              <div className='w-full h-[170px] flex items-center justify-center bg-gray-100 text-red'>
                {error}
              </div>
              )
            : (
              <div
                ref={mapRef}
                className='smobile:max-h-[240px] smobile:h-[240px] mobile:max-h-[280px] mobile:h-[280px] tablet:max-h-[491px] tablet:h-[491px] smobile:w-full laptop:w-[80%] laptop:max-w-[910px] desktop:max-w-[983px] desktop:h-[591px] desktop:max-h-[553px] bdesktop:max-w-[1065px] bdesktop:h-[600px] bdesktop:max-h-[600px]'
              />
              )}
        </div>
      </section>
      )
}
