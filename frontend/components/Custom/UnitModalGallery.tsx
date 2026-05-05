'use client'

import * as React from 'react'
import * as Sentry from '@sentry/nextjs'
import assets from '@/assets'
import Image from 'next/image'
import { UnitModalGalleryDropdown } from './UnitModalGalleryDropdown'
import { LoaderSpinner } from '../Spinners/LoaderSpinner'
import { getFloorUnits, getPropertyUnits } from '@/lib/property-units'

interface Props {
  data: ActionGetPropertyBySlug
  unitId: string
  views: boolean
  currentFloorData: Floor | undefined
  onUnitIdChange: (unitId: number) => void
}

export function UnitModalGallery ({ data, views, unitId, currentFloorData, onUnitIdChange }: Props): React.ReactNode {
  const [selectedObjectIndex, setSelectedObjectIndex] = React.useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const [unitGalleryMediaIndex, setUnitGalleryMediaIndex] = React.useState(0)
  const [selectedGalleryType, setSelectedGalleryType] = React.useState<string>('')
  const [currentImageGalleryMedia, setCurrentImageGalleryMedia] = React.useState<ServerSubGalleryData | { data?: StrapiMedia[] } | undefined>(undefined)
  const [currentImageGallery, setCurrentImageGallery] = React.useState<ImageGallery['marketPlace'] | undefined>(undefined)
  const [facilitiesData, setFacilitiesData] = React.useState<ActionGetPropertyBySlug['AmenitiesGallery'] | undefined>(undefined)
  const [exteriorData, setExteriorData] = React.useState<ActionGetPropertyBySlug['Gallery'] | undefined>(undefined)
  const [interiorData, setInteriorData] = React.useState<ActionGetPropertyBySlug['InteriorGallery'] | undefined>(undefined)
  const [unitGallery, setUnitGallery] = React.useState<{ data?: StrapiMedia[] } | null>(null)
  const imageRef = React.useRef<HTMLImageElement>(null)
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false)
  const fullScreenTailwindStyles = isFullScreen ? 'smobile:object-contain laptop:object-cover' : ''
  const [openDropdowns, setOpenDropdowns] = React.useState([false, false, false])
  const [isFacilitiesEmpty, setIsFacilitiesEmpty] = React.useState<boolean>(false)
  const [isExteriorEmpty, setIsExteriorEmpty] = React.useState<boolean>(false)
  const [isViewsGalleryEmpty, setIsViewsGalleryEmpty] = React.useState<boolean>(false)
  const [isUnitGalleryEmpty, setIsUnitGalleryEmpty] = React.useState<boolean>(false)
  const [systemChoose, setSystemChoose] = React.useState<boolean>(false)
  const [blurDataUrls, setBlurDataUrls] = React.useState<string[]>([])
  const [unitBlurDataUrls, setUnitBlurDataUrls] = React.useState<string[]>([])
  const [loadingBlur, setLoadingBlur] = React.useState<boolean>(false)
  const [loadingUnitBlur, setLoadingUnitBlur] = React.useState<boolean>(false)
  const [galleryImageLoaded, setGalleryImageLoaded] = React.useState<boolean>(false)
  const [unitImageLoaded, setUnitImageLoaded] = React.useState<boolean>(false)

  function toggleDropdown (index: number): void {
    setOpenDropdowns(openDropdowns.map((isOpen, i) => i === index ? !isOpen : false))
  }

  async function handleFullScreen (): Promise<void> {
    if (imageRef.current !== null) {
      if (document.fullscreenElement !== null) {
        await document.exitFullscreen()
      } else {
        await imageRef.current.requestFullscreen()
      }
    }
  }

  function handleOutsideClick (event: MouseEvent): void {
    const firstDropdown = document.getElementById('fs-dropdown-1')
    const secondDropdown = document.getElementById('fs-dropdown-2')
    const thirdDropdown = document.getElementById('fs-dropdown-3')

    if (
      !(firstDropdown?.contains(event.target as Node) ?? false) &&
      !(secondDropdown?.contains(event.target as Node) ?? false) &&
      !(thirdDropdown?.contains(event.target as Node) ?? false)
    ) {
      setOpenDropdowns([false, false, false])
    }
  }

  function handleObjectIndexChange (index: number): void {
    setSelectedObjectIndex(index)
  }

  function handleGalleryIndexRise (): void {
    setGalleryImageLoaded(false)
    setSelectedImageIndex(prev => prev + 1)
  }

  function handleGalleryIndexDown (): void {
    setGalleryImageLoaded(false)
    setSelectedImageIndex(prev => prev - 1)
  }

  function handleSubGalleryMediaChange (index: number): void {
    setGalleryImageLoaded(false)
    setSelectedImageIndex(0)
    setCurrentImageGalleryMedia(currentImageGallery?.SubGallery?.[index])
  }

  function handleUnitGalleryIndexRise (): void {
    setUnitImageLoaded(false)
    setUnitGalleryMediaIndex(prev => prev + 1)
  }

  function handleUnitGalleryIndexDown (): void {
    setUnitImageLoaded(false)
    setUnitGalleryMediaIndex(prev => prev - 1)
  }

  function handleChangeGalleryType (variant: number): void {
    switch (variant) {
      case 1:
        setGalleryImageLoaded(false)
        setUnitImageLoaded(false)
        setCurrentImageGallery(exteriorData)
        setSelectedGalleryType('Exterior')
        handleObjectIndexChange(1)
        setCurrentImageGalleryMedia(exteriorData?.SubGallery?.[0])
        setSelectedImageIndex(0)
        setSystemChoose(false)
        break

      case 2:
        setGalleryImageLoaded(false)
        setUnitImageLoaded(false)
        setCurrentImageGallery(interiorData)
        setSelectedGalleryType('Interior')
        handleObjectIndexChange(2)
        setCurrentImageGalleryMedia(interiorData?.SubGallery?.[0])
        setSelectedImageIndex(0)
        setSystemChoose(false)
        break

      case 3:
        setGalleryImageLoaded(false)
        setUnitImageLoaded(false)
        setCurrentImageGallery(facilitiesData)
        setSelectedGalleryType('Facilities')
        handleObjectIndexChange(3)
        setCurrentImageGalleryMedia(facilitiesData?.SubGallery?.[0])
        setSelectedImageIndex(0)
        setSystemChoose(false)
        break

      default:
        break
    }
  }

  React.useEffect(() => {
    if (data !== undefined && !views) {
      setFacilitiesData(data.AmenitiesGallery)
      setExteriorData(data.Gallery)
      setInteriorData(data.InteriorGallery)
      const isFacilitiesEmpty = data.AmenitiesGallery.SubGallery?.every(item => item.Media.data === null) ?? false
      const isExteriorEmpty = data.Gallery.SubGallery?.every(item => item.Media.data === null) ?? false
      setIsFacilitiesEmpty(isFacilitiesEmpty)
      setIsExteriorEmpty(isExteriorEmpty)
      if (!isExteriorEmpty) {
        setCurrentImageGallery(data.Gallery)
        setCurrentImageGalleryMedia(data.Gallery?.SubGallery?.[0])
        setSelectedObjectIndex(1)
        setSelectedGalleryType('Exterior')
      } else if (!isFacilitiesEmpty) {
        setCurrentImageGallery(data.AmenitiesGallery)
        setCurrentImageGalleryMedia(data.AmenitiesGallery?.SubGallery?.[0])
        setSelectedObjectIndex(3)
        setSelectedGalleryType('Facilities')
      }
    } else if (data !== undefined && views) {
      const isViewsEmpty = data.ViewsGallery.SubGallery?.every(item => item.Media.data === null) ?? false
      setIsViewsGalleryEmpty(isViewsEmpty)
      setCurrentImageGalleryMedia(data.ViewsGallery?.SubGallery?.[0])
      setCurrentImageGallery(data.ViewsGallery)
      setSelectedObjectIndex(1)
      setSelectedGalleryType('Exterior')
    }
  }, [data])

  React.useEffect(() => {
    if (data !== undefined) {
      const unit = getPropertyUnits(data).filter(item => item.id === parseInt(unitId))

      if (unit[0]?.attributes.unitGallery === undefined) return
      setUnitGallery(unit[0].attributes.unitGallery)
      setIsUnitGalleryEmpty(unit[0].attributes.unitGallery.data === null)
      setUnitGalleryMediaIndex(0)
      setSystemChoose(true)
    }
  }, [unitId])

  React.useEffect(() => {
    function handleFullScreenChange (): void {
      setIsFullScreen(document.fullscreenElement !== null)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
    }
  }, [])

  React.useEffect(() => {
    if (openDropdowns.some(isOpen => isOpen)) {
      document.addEventListener('mousedown', handleOutsideClick)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [openDropdowns])

  React.useEffect(() => {
    async function fetchImageBase64 (url: string): Promise<string> {
      const res = await fetch(url)
      const arrayBuffer = await res.arrayBuffer()
      return Buffer.from(arrayBuffer).toString('base64')
    }

    async function loadBlurDataUrls (): Promise<void> {
      if (((currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data) !== null) {
        setLoadingBlur(true)
        const urls = (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data
          ?.map((item) => item.attributes.formats?.thumbnail.url ?? '')
          .filter((item) => item !== '')

        if (urls === undefined) {
          const localImageUrl = '/empty-skeleton.jpg'
          const localBlur = await fetchImageBase64(localImageUrl)
          const blurs = [localBlur]
          setBlurDataUrls(blurs)
          setLoadingBlur(false)
        }
        if (urls !== undefined) {
          try {
            const blurs = await Promise.all(
              urls.map(async (url: string) => {
                try {
                  return await fetchImageBase64(url)
                } catch (err) {
                  Sentry.captureException(err)
                  return null
                }
              })
            )

            setBlurDataUrls(blurs.filter((it): it is string => it !== null))
          } catch (err) {
            Sentry.captureException(err)
          } finally {
            setLoadingBlur(false)
          }
        }
      }
    }

    void loadBlurDataUrls()
  }, [currentImageGallery, currentImageGalleryMedia])

  React.useEffect(() => {
    async function fetchImageBase64 (url: string): Promise<string> {
      const res = await fetch(url)
      const arrayBuffer = await res.arrayBuffer()
      return Buffer.from(arrayBuffer).toString('base64')
    }

    async function loadUnitBlurDataUrls (): Promise<void> {
      if (unitGallery?.data !== null) {
        setLoadingUnitBlur(true)
        const urls = unitGallery?.data
          ?.map(item => item.attributes.formats?.thumbnail.url ?? '')
          .filter((item) => item !== '')

        if (urls === undefined) {
          const localImageUrl = '/empty-skeleton.jpg'
          const localBlur = await fetchImageBase64(localImageUrl)
          const blurs = [localBlur]
          setUnitBlurDataUrls(blurs)
          setLoadingUnitBlur(false)
        }
        if (urls !== undefined) {
          try {
            const blurs = await Promise.all(
              urls.map(async (url) => {
                try {
                  return await fetchImageBase64(url)
                } catch (err) {
                  Sentry.captureException(err)
                  return null
                }
              })
            )

            setUnitBlurDataUrls(blurs.filter((it): it is string => it !== null))
          } catch (err) {
            Sentry.captureException(err)
          } finally {
            setLoadingUnitBlur(false)
          }
        }
      }
    }

    void loadUnitBlurDataUrls()
  }, [unitGallery])

  React.useEffect(() => {
    function selectAvailableGallery (): void {
      if (selectedGalleryType === 'Interior' && isUnitGalleryEmpty) {
        if (!isExteriorEmpty) {
          return handleChangeGalleryType(1)
        } else if (!isFacilitiesEmpty) {
          return handleChangeGalleryType(3)
        }
      }

      if (selectedGalleryType === 'Exterior' && isExteriorEmpty) {
        if (!isUnitGalleryEmpty) {
          return handleChangeGalleryType(2)
        } else if (!isFacilitiesEmpty) {
          return handleChangeGalleryType(3)
        }
      }

      if (selectedGalleryType === 'Facilities' && isFacilitiesEmpty) {
        if (!isExteriorEmpty) {
          return handleChangeGalleryType(1)
        } else if (!isUnitGalleryEmpty) {
          return handleChangeGalleryType(2)
        }
      }
    }

    if (systemChoose) {
      selectAvailableGallery()
    }
  }, [systemChoose])

  return (
    (isFacilitiesEmpty && isExteriorEmpty && isUnitGalleryEmpty && !views) || (views && isViewsGalleryEmpty)
      ? null
      : (
        <div className='flex flex-col w-full relative' ref={imageRef}>
          <div className='w-full h-full overflow-hidden'>
            {isFullScreen && (
              <div className='smobile:w-full smobile:px-[16px] smobile:py-[16px] laptop:hidden laptop:h-0'>
                <UnitModalGalleryDropdown
                  currentFloorData={currentFloorData}
                  onUnitIdChange={onUnitIdChange}
                  unitId={unitId}
                  caseNumber={1}
                  currentGallery={selectedGalleryType}
                  currentImageGallery={currentImageGallery}
                  currentImageGalleryMedia={currentImageGalleryMedia}
                  dropdowns={openDropdowns}
                  views={views}
                  toggleDropdown={toggleDropdown}
                  onGalleryChange={handleChangeGalleryType}
                  onSubGalleryChange={handleSubGalleryMediaChange}
                />
                {!views && (
                  <UnitModalGalleryDropdown
                    currentFloorData={currentFloorData}
                    onUnitIdChange={onUnitIdChange}
                    unitId={unitId}
                    caseNumber={2}
                    currentGallery={selectedGalleryType}
                    currentImageGallery={currentImageGallery}
                    currentImageGalleryMedia={currentImageGalleryMedia}
                    dropdowns={openDropdowns}
                    views={views}
                    toggleDropdown={toggleDropdown}
                    onGalleryChange={handleChangeGalleryType}
                    onSubGalleryChange={handleSubGalleryMediaChange}
                  />
                )}
                <UnitModalGalleryDropdown
                  currentFloorData={currentFloorData}
                  onUnitIdChange={onUnitIdChange}
                  unitId={unitId}
                  caseNumber={3}
                  currentGallery={selectedGalleryType}
                  currentImageGallery={currentImageGallery}
                  currentImageGalleryMedia={currentImageGalleryMedia}
                  dropdowns={openDropdowns}
                  views={views}
                  toggleDropdown={toggleDropdown}
                  onGalleryChange={handleChangeGalleryType}
                  onSubGalleryChange={handleSubGalleryMediaChange}
                />
              </div>
            )}
            {loadingBlur && selectedGalleryType !== 'Interior'
              ? (
                <LoaderSpinner
                  width={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex]?.attributes.width ?? undefined}
                  height={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex]?.attributes.height ?? undefined}
                  isUnitGallery
                />
                )
              : (
                  ['Exterior', 'Facilities'].includes(selectedGalleryType) && (
                    <>
                      {(currentImageGalleryMedia as ServerSubGalleryData)?.Media === undefined && (
                        <Image
                          priority
                          src='/empty-skeleton.jpg'
                          alt='Gallery image skeleton'
                          width='1093'
                          height='980'
                          style={isFullScreen ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', objectFit: 'contain', width: '100vw', height: '100vh', maxHeight: 'none' } : {}}
                          className={`w-full smobile:max-h-[230px] mobile:max-h-[264px] tablet:max-h-[470px] laptop:max-h-none h-full object-cover select-none ${fullScreenTailwindStyles}`}
                        />
                      )}
                      <div className='laptop:h-full laptop:w-full' style={galleryImageLoaded ? { display: 'none' } : { display: 'block' }}>
                        <Image
                          priority
                          key={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id}
                          src={`data:image/png;base64,${blurDataUrls[selectedImageIndex]}`}
                          alt='Gallery image'
                          width={
                            (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.width ?? 1000
                          }
                          height={
                            (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.height ?? 900
                          }
                          style={isFullScreen ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', objectFit: 'contain', width: '100vw', height: '100vh', maxHeight: 'none' } : galleryImageLoaded ? { display: 'none' } : {}}
                          className={`w-full smobile:max-h-[230px] mobile:max-h-[264px] tablet:max-h-[470px] laptop:max-h-none h-full object-cover select-none ${fullScreenTailwindStyles}`}
                        />
                      </div>
                      <Image
                        priority
                        key={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id}
                        onLoad={() => setGalleryImageLoaded(true)}
                        src={
                          (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.url !== undefined
                            ? (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.url ?? ''
                            : '/empty-skeleton.jpg'
                        }
                        alt='Gallery image'
                        width={
                          (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.width ?? 1000
                        }
                        height={
                          (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.height ?? 900
                        }
                        style={isFullScreen ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', objectFit: 'contain', width: '100vw', height: '100vh', maxHeight: 'none' } : !galleryImageLoaded ? { display: 'none' } : {}}
                        className={`w-full smobile:max-h-[230px] mobile:max-h-[264px] tablet:max-h-[470px] laptop:max-h-none h-full object-cover select-none ${fullScreenTailwindStyles}`}
                      />
                    </>
                  )
                )}
            {loadingUnitBlur && selectedGalleryType === 'Interior'
              ? (
                <LoaderSpinner
                  width={unitGallery?.data?.[unitGalleryMediaIndex]?.attributes.width ?? undefined}
                  height={unitGallery?.data?.[unitGalleryMediaIndex]?.attributes.height ?? undefined}
                  isUnitGallery
                />
                )
              : (
                  selectedGalleryType === 'Interior' && (
                    <>
                      {unitGallery === null && (
                        <Image
                          priority
                          src='/empty-skeleton.jpg'
                          alt='Unit gallery image skeleton'
                          width='1093'
                          height='980'
                          style={isFullScreen ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', objectFit: 'contain', width: '100vw', height: '100vh', maxHeight: 'none' } : {}}
                          className={`w-full smobile:max-h-[230px] mobile:max-h-[264px] tablet:max-h-[470px] laptop:max-h-none h-full object-cover select-none ${fullScreenTailwindStyles}`}
                        />
                      )}
                      <div className='laptop:h-full laptop:w-full' style={unitImageLoaded ? { display: 'none' } : { display: 'block' }}>
                        <Image
                          priority
                          key={unitGallery?.data?.[unitGalleryMediaIndex].id}
                          src={`data:image/png;base64,${unitBlurDataUrls[unitGalleryMediaIndex]}`}
                          alt='Unit gallery image'
                          width={unitGallery?.data?.[unitGalleryMediaIndex].attributes.width ?? 1000}
                          height={unitGallery?.data?.[unitGalleryMediaIndex].attributes.height ?? 900}
                          style={isFullScreen ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', objectFit: 'contain', width: '100vw', height: '100vh', maxHeight: 'none' } : unitImageLoaded ? { display: 'none' } : {}}
                          className={`w-full smobile:max-h-[230px] mobile:max-h-[264px] tablet:max-h-[470px] laptop:max-h-none h-full object-cover select-none ${fullScreenTailwindStyles}`}
                        />
                      </div>
                      <Image
                        priority
                        key={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id}
                        onLoad={() => setUnitImageLoaded(true)}
                        src={unitGallery?.data?.[unitGalleryMediaIndex].attributes.url !== undefined
                          ? unitGallery?.data?.[unitGalleryMediaIndex].attributes.url
                          : '/empty-skeleton.jpg'}
                        alt='Unit gallery image'
                        width={unitGallery?.data?.[unitGalleryMediaIndex].attributes.width ?? 1000}
                        height={unitGallery?.data?.[unitGalleryMediaIndex].attributes.height ?? 900}
                        style={isFullScreen ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', objectFit: 'contain', width: '100vw', height: '100vh', maxHeight: 'none' } : !unitImageLoaded ? { display: 'none' } : {}}
                        className={`w-full smobile:max-h-[230px] mobile:max-h-[264px] tablet:max-h-[470px] laptop:max-h-none h-full object-cover select-none ${fullScreenTailwindStyles}`}
                      />
                    </>
                  )
                )}
          </div>
          {!views && (
            <div className={`smobile:grid smobile:grid-cols-3 smobile:gap-0 smobile:w-full smobile:mt-[20px] ${isFullScreen ? 'smobile:hidden smobile:h-0' : ''} laptop:mt-0 laptop:absolute laptop:flex laptop:flex-col laptop:w-full laptop:max-w-[166px] laptop:right-[20px] laptop:top-[20px]`}>
              <button
                type='button'
                className={`py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 disabled:cursor-not-allowed ${selectedObjectIndex === 1 ? 'bg-opacity-100 bg-black text-white' : 'bg-greyButtonsRGBA text-black'} transition-colors duration-200`}
                onClick={() => {
                  handleChangeGalleryType(1)
                }}
                disabled={exteriorData?.SubGallery?.length === 0 || selectedObjectIndex === 1}
                style={exteriorData?.SubGallery?.length === 0 ? { display: 'none', height: '0' } : {}}
              >
                Exterior
              </button>
              <button
                type='button'
                className={`py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 disabled:cursor-not-allowed ${selectedObjectIndex === 2 ? 'bg-opacity-100 bg-black text-white' : 'bg-greyButtonsRGBA text-black'} transition-colors duration-200`}
                onClick={() => {
                  handleChangeGalleryType(2)
                }}
                disabled={unitGallery?.data?.length === 0 || unitGallery?.data === null || selectedObjectIndex === 2}
                style={unitGallery?.data?.length === 0 || unitGallery?.data === null ? { display: 'none', height: '0' } : {}}
              >
                Interior
              </button>
              <button
                type='button'
                className={`py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 disabled:cursor-not-allowed ${selectedObjectIndex === 3 ? 'bg-opacity-100 bg-black text-white' : 'bg-greyButtonsRGBA text-black'} transition-colors duration-200`}
                onClick={() => {
                  handleChangeGalleryType(3)
                }}
                disabled={facilitiesData?.SubGallery?.length === 0 || selectedObjectIndex === 3}
                style={facilitiesData?.SubGallery?.length === 0 ? { display: 'none', height: '0' } : {}}
              >
                Facilities
              </button>
            </div>
          )}
          {!views && (
            <ul className='smobile:hidden smobile:h-0 laptop:flex laptop:h-auto laptop:absolute laptop:flex-col laptop:w-full laptop:left-[20px] laptop:m-0 laptop:top-[20px] laptop:max-w-[166px]'>
              {getFloorUnits(currentFloorData).map((item) => (
                <li key={item.id}>
                  <button
                    type='button'
                    className={`w-[150px] py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 ${item.id === parseInt(unitId) ? 'bg-opacity-100 bg-black text-white' : 'bg-greyButtonsRGBA text-black'} transition-colors duration-200 laptop:w-full laptop:max-w-[166px]`}
                    onClick={() => { onUnitIdChange(item.id) }}
                  >
                    {item.attributes.identifier}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selectedGalleryType !== 'Interior' && (
            <ul className={`smobile:grid smobile:grid-cols-2 smobile:gap-4 smobile:w-full smobile:pt-[20px] smobile:border-t smobile:border-r-zinc-400 ${isFullScreen ? 'smobile:hidden smobile:h-0 laptop:flex laptop:m-0 laptop:h-auto' : ''} ${views ? 'laptop:top-[20px] laptop:right-[20px] laptop:gap-0 bdesktop:pt-[20px]' : 'laptop:top-[20px] laptop:gap-0 laptop:right-[217px]'} laptop:flex laptop:border-none laptop:absolute laptop:flex-col laptop:w-full laptop:m-0 laptop:pt-0 laptop:max-w-[166px]`}>
              {currentImageGallery?.SubGallery?.map((item, index) => (
                <li key={item.id} style={(item.Media.data === null || item.Media.data.length === 0) ? { display: 'none', height: '0px' } : {}}>
                  <button
                    type='button'
                    className={`w-full py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 ${item.id === (currentImageGalleryMedia as ServerSubGalleryData)?.id ? 'bg-opacity-100 bg-black text-white' : 'bg-greyButtonsRGBA text-black'} disabled:cursor-not-allowed transition-colors duration-200 laptop:w-full laptop:max-w-[166px]`}
                    onClick={() => { handleSubGalleryMediaChange(index) }}
                    disabled={item.id === (currentImageGalleryMedia as ServerSubGalleryData)?.id}
                  >
                    {item.Name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div
            style={isFullScreen ? { margin: '0' } : {}}
            className={`smobile:flex smobile:justify-between smobile:w-full ${isFullScreen ? 'smobile:px-[16px] smobile:absolute smobile:bottom-[18px] mobile:bottom-[32px] tablet:bottom-[34px] laptop:px-[20px] desktop:px-[32px]' : ''} smobile:mt-[50px] smobile:mb-[50px] laptop:absolute laptop:m-0 laptop:bottom-[20px] laptop:px-[20px] desktop:px-[32px] bdesktop:px-[20px]`}
          >
            {selectedGalleryType === 'Interior' && (
              <button
                type='button'
                style={unitGalleryMediaIndex === 0 ? { opacity: '0', userSelect: 'none', cursor: 'default' } : {}}
                disabled={unitGalleryMediaIndex === 0}
                onClick={handleUnitGalleryIndexDown}
                className={`smobile:py-[16px] smobile:px-[16px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
              >
                <assets.ChevronLeftSVG
                  width={16}
                  height={16}
                  className='smobile:w-[16px] smobile:h-[16px] smobile:stroke-white'
                />
              </button>
            )}
            {selectedGalleryType !== 'Interior' && (
              <button
                type='button'
                disabled={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id === (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[0].id}
                style={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id === (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[0].id ? { opacity: '0', userSelect: 'none', cursor: 'default' } : {}}
                onClick={handleGalleryIndexDown}
                className={`smobile:py-[16px] smobile:px-[16px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
              >
                <assets.ChevronLeftSVG
                  width={16}
                  height={16}
                  className='smobile:w-[16px] smobile:h-[16px] smobile:stroke-white'
                />
              </button>
            )}
            <div className='smobile:flex gap-3 items-center'>
              {isFullScreen
                ? (
                  <button
                    type='button'
                    onClick={() => {
                      void handleFullScreen()
                    }}
                    className={`smobile:py-[16px] smobile:px-[16px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
                  >
                    <assets.MinimazeSVG
                      width={16}
                      height={16}
                      className='smobile:w-[16px] smobile:h-[16px] smobile:stroke-white'
                    />
                  </button>
                  )
                : (
                  <button
                    type='button'
                    onClick={() => {
                      void handleFullScreen()
                    }}
                    className={`smobile:py-[16px] smobile:px-[16px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
                  >
                    <assets.MaximizeSVG
                      width={16}
                      height={16}
                      className='smobile:w-[16px] smobile:h-[16px] smobile:stroke-white'
                    />
                  </button>
                  )}
              {selectedGalleryType === 'Interior' && (
                <button
                  type='button'
                  disabled={(unitGallery?.data?.[unitGalleryMediaIndex]?.id === unitGallery?.data?.[unitGallery?.data.length - 1]?.id)}
                  style={(unitGallery?.data?.[unitGalleryMediaIndex]?.id === unitGallery?.data?.[unitGallery?.data.length - 1]?.id) ? { display: 'none' } : {}}
                  onClick={handleUnitGalleryIndexRise}
                  className={`smobile:py-[16px] smobile:px-[16px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
                >
                  <assets.ChevronRightSVG
                    width={16}
                    height={16}
                    className='smobile:w-[16px] smobile:h-[16px] smobile:stroke-white'
                  />
                </button>
              )}
              {selectedGalleryType !== 'Interior' && (
                <button
                  type='button'
                  disabled={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id === (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[((currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.length ?? 1) - 1].id}
                  style={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id === (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[((currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.length ?? 1) - 1].id ? { display: 'none' } : {}}
                  onClick={handleGalleryIndexRise}
                  className={`smobile:py-[16px] smobile:px-[16px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
                >
                  <assets.ChevronRightSVG
                    width={16}
                    height={16}
                    className='smobile:w-[16px] smobile:h-[16px] smobile:stroke-white'
                  />
                </button>
              )}
            </div>
          </div>
        </div>
        )
  )
}
