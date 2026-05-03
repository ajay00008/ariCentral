'use client'

import * as React from 'react'
import { convertPriceWithSuffix, formatPrice } from '@/constants/currencies'
import { registerGoogleMaps } from '@/lib/google-maps'
import { heroImages } from '@/lib/hero-images'

interface Props {
  addresses: string[] | null
  searchResultData: ActionSearchPropertiesByParams
  currency: Currency
}

let previousInfoWindow: google.maps.InfoWindow | undefined

function generatePropertyWindowHTML (
  searchResultData: FullProperty,
  currency: Currency
): string {
  const lowerPricedUnit = searchResultData.attributes.LowerPricedUnit

  const backwardURL =
    `${window.origin}/${searchResultData.attributes.Slug}`.toString()
  const heroImage = heroImages(searchResultData.attributes)[0]
  const imageUrl = heroImage.Image.data.attributes.url ?? '/empty-skeleton.jpg'
  const imageWidth = heroImage.Image.data.attributes.width ?? 125
  const imageHeight = heroImage.Image.data.attributes.height ?? 125
  const name = searchResultData.attributes.Name
  const address = searchResultData.attributes.Address
  const price =
    lowerPricedUnit?.attributes.price !== undefined &&
    lowerPricedUnit.attributes.price !== null
      ? `Priced from ${formatPrice(
          currency,
          convertPriceWithSuffix(
            currency,
            lowerPricedUnit.attributes.price.toLocaleString('en-US')
          ),
          false,
          false,
          true
        )}`
      : 'No price installed.'
  const commission = `${searchResultData.attributes.Commission}% Commission`

  return `
  ${searchResultData.attributes.Approved
    ? `<a href="${backwardURL}" target="_blank" rel="noopener noreferrer" class="smobile:max-w-[300px] smobile:min-h-[125px] smobile:w-[300px] smobile:flex smobile:gap-[16px] smobile:items-center">`
    : '<div class="smobile:max-w-[300px] smobile:min-h-[125px] smobile:w-[300px] smobile:flex  smobile:items-center">'}
    <img
      id="infoWindowImage"
      src="${imageUrl}"
      alt="Property Hero image"
      width="${imageWidth}"
      height="${imageHeight}"
      class="smobile:w-full object-cover smobile:h-full smobile:max-w-[125px] smobile:max-h-[125px] smobile:min-h-[125px] mobile:object-cover"
    />
    <div class="smobile:flex smobile:flex-col gap-1 p-2">
    <div class="smobile:flex smobile:flex-col">
      <h2 class="font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:mb-[6px] smobile:text-black smobile:max-w-[155px] smobile:overflow-hidden smobile:text-ellipsis">${name}</h2>
      <p class="font-mundialRegular smobile:text-[10px] smobile:leading-[1] smobile:mb-[14px] smobile:text-black">${address}</p>
      <p class="font-mundialRegular smobile:text-[10px] smobile:leading-[1] mb-[3px] smobile:text-customGrey">${price}</p>
      <p class="font-mundialRegular smobile:text-[10px] smobile:leading-[1] smobile:text-customGrey">${commission}</p>
    </div>
    <div style="flex:1;display:flex;align-items:end;justify-content:end;">
      <div
        style="width:100%;min-height:28px;background:${searchResultData.attributes.Approved ? '#FF6600' : '#D1D1D1'};color:${searchResultData.attributes.Approved ? '#fff' : '#222'};border:none;border-radius:0;padding:8px;font-size:14px;cursor:${searchResultData.attributes.Approved ? 'pointer' : 'not-allowed'};font-family:inherit;align-text:center;display:flex;align-items:center;justify-content:center;"
      >
        ${searchResultData.attributes.RequestStatus === 'not_requested'
          ? '🔒 REQUEST ACCESS'
          : searchResultData.attributes.RequestStatus === 'pending'
            ? 'ACCESS PENDING'
            : searchResultData.attributes.RequestStatus === 'approved'
              ? 'VIEW DETAILS'
              : 'REJECTED'}
      </div>
    </div>
    </div>
  ${searchResultData.attributes.Approved ? '</a>' : '</div>'}
`
}

function attachSecretMessage (
  marker: google.maps.marker.AdvancedMarkerElement,
  secretMessage: string
): void {
  const infowindow = new google.maps.InfoWindow({
    content: secretMessage
  })

  infowindow.addListener('domready', () => {
    const elementToRemove = document.querySelector('.gm-style-iw-ch')
    if (elementToRemove !== null) {
      elementToRemove.remove()
    }
    const closeButtonContainer = document.querySelector('.gm-style-iw-chr')
    if (closeButtonContainer !== null) {
      closeButtonContainer.remove()
    }
    const images = document.querySelectorAll<HTMLElement>('#infoWindowImage')
    images.forEach((img) => {
      img.style.setProperty('max-width', '130px', 'important')
    })
    const iwContainer = document.querySelector<HTMLElement>('.gm-style-iw')
    if (iwContainer !== null) {
      iwContainer.style.padding = '0'
    }
    const iwContent = document.querySelector<HTMLElement>('.gm-style-iw-d')
    if (iwContent !== null) {
      iwContent.style.overflow = 'hidden'
    }
  })

  marker.addListener('click', () => {
    if (previousInfoWindow !== undefined) {
      previousInfoWindow.close()
    }

    previousInfoWindow = infowindow

    infowindow.open(marker.map, marker)
    setTimeout(() => {
      const iwDialogContainer =
        document.querySelector<HTMLElement>('.gm-style-iw-c')
      if (iwDialogContainer !== null) {
        iwDialogContainer.style.setProperty('max-width', '400px', 'important')
        iwDialogContainer.style.maxWidth = '400px'
        iwDialogContainer.style.minWidth = '300px'
      }
    }, 500)
  })
}

export function MapMultiple ({
  addresses,
  currency,
  searchResultData
}: Props): React.ReactNode {
  const mapRef = React.useRef<HTMLDivElement | null>(null)
  const mapInstance = React.useRef<google.maps.Map | null>(null)

  React.useEffect(() => {
    async function initMap (): Promise<void> {
      if (mapRef.current === null || addresses === null) {
        return
      }

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: 0, lng: 0 },
        disableDefaultUI: true,
        zoomControl: true,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID
      })

      const markers: google.maps.marker.AdvancedMarkerElement[] = []
      const geocoder = new window.google.maps.Geocoder()
      const bounds = new google.maps.LatLngBounds()

      const geocodePromises = addresses.map(async (address, index) => {
        return await new Promise<void>((resolve, reject) => {
          void geocoder.geocode({ address }, (results, status) => {
            if (status !== 'OK' || results === null) {
              reject(new Error(status))
              return
            }

            const location = results[0].geometry.location
            const pinDiv = document.createElement('div')

            pinDiv.style.width = '24px'
            pinDiv.style.height = '24px'
            pinDiv.style.backgroundColor = 'black'
            pinDiv.style.borderRadius = '50%'
            pinDiv.style.cursor = 'pointer'

            const marker = new google.maps.marker.AdvancedMarkerElement({
              map: mapInstance.current,
              position: location,
              content: pinDiv,
              title: searchResultData.data[index].attributes.Name
            })

            mapInstance.current?.addListener('click', () => {
              if (previousInfoWindow !== undefined) {
                previousInfoWindow.close()
                previousInfoWindow = undefined
              }
            })

            if (searchResultData.data !== undefined) {
              const foundedProperty = searchResultData.data.find((it) => {
                return (
                  it.attributes.Address !== null &&
                  it.attributes.Address !== '' &&
                  it.attributes.Address.replace(/\s+/g, ' ').trim() === address
                )
              })

              if (foundedProperty === undefined) {
                reject(new Error('Property not found'))
                return
              }

              const infoWindowContent = generatePropertyWindowHTML(
                foundedProperty,
                currency
              )
              attachSecretMessage(marker, infoWindowContent)
            }

            markers.push(marker)
            bounds.extend(location)

            resolve()
          })
        })
      })

      await Promise.all(geocodePromises)

      if (mapInstance.current !== null) {
        mapInstance.current.fitBounds(bounds)

        setTimeout(() => {
          if (mapInstance.current !== null && addresses.length > 1) {
            const currentZoom = mapInstance.current.getZoom()
            if (currentZoom === undefined) {
              throw new Error('Unable to determine current zoom')
            }
            mapInstance.current.setZoom(currentZoom - 0.5)
          } else if (mapInstance.current !== null && addresses.length === 1) {
            mapInstance.current.setZoom(16)
          }
        }, 500)
      }
    }

    if (window.google === undefined) {
      registerGoogleMaps()
      window.initMap = initMap
    } else {
      void initMap()
    }
  }, [addresses])

  return (
    <section id='mapMultiple' className='w-full h-full'>
      <div
        ref={mapRef}
        className='smobile:w-full smobile:h-[688px] mobile:h-[765px] tablet:h-[975px] laptop:h-[700px] desktop:h-[800px] bdesktop:h-[955px]'
      />
    </section>
  )
}
