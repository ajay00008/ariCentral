'use client'

import * as React from 'react'
import * as Sentry from '@sentry/nextjs'
import assets from '@/assets'
import Image from 'next/image'
import { UnitModalGalleryDropdown } from '../Custom/UnitModalGalleryDropdown'
import { LoaderSpinner } from '../Spinners/LoaderSpinner'

interface Props {
  data: ActionGetPropertyBySlug
  unitId: string
  views: boolean
  currentFloorData: Floor | undefined
  onUnitIdChange: (unitId: number) => void
}

export function ImageGallerySection2 ({ data, views, unitId, currentFloorData, onUnitIdChange }: Props): React.ReactNode {
  const [selectedObjectIndex, setSelectedObjectIndex] = React.useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const [selectedGalleryType, setSelectedGalleryType] = React.useState<string>('')
  const [currentImageGalleryMedia, setCurrentImageGalleryMedia] = React.useState<ServerSubGalleryData | { data?: StrapiMedia[] } | undefined>(undefined)
  const [currentImageGallery, setCurrentImageGallery] = React.useState<ImageGallery['marketPlace'] | undefined>(undefined)
  const [facilitiesData, setFacilitiesData] = React.useState<ActionGetPropertyBySlug['AmenitiesGallery'] | undefined>(undefined)
  const [exteriorData, setExteriorData] = React.useState<ActionGetPropertyBySlug['Gallery'] | undefined>(undefined)
  const [interiorData, setInteriorData] = React.useState<ActionGetPropertyBySlug['InteriorGallery'] | undefined>(undefined)
  const imageRef = React.useRef<HTMLImageElement>(null)
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false)
  const fullScreenTailwindStyles = isFullScreen ? 'smobile:object-contain laptop:object-cover' : ''
  const [openDropdowns, setOpenDropdowns] = React.useState([false, false, false])
  const [isFacilitiesGalleryEmpty, setIsFacilitiesGalleryEmpty] = React.useState<boolean>(false)
  const [isExteriorGalleryEmpty, setIsExteriorGalleryEmpty] = React.useState<boolean>(false)
  const [isViewsGalleryEmpty, setIsViewsGalleryEmpty] = React.useState<boolean>(false)
  const [isInteriorGalleryEmpty, setIsInteriorGalleryEmpty] = React.useState<boolean>(false)
  const [blurDataUrls, setBlurDataUrls] = React.useState<string[]>([])
  const [loadingBlur, setLoadingBlur] = React.useState<boolean>(false)
  const [galleryImageLoaded, setGalleryImageLoaded] = React.useState<boolean>(false)

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

  const handleChangeGalleryType = (variant: number): void => {
    switch (variant) {
      case 1:
        setGalleryImageLoaded(false)
        setCurrentImageGallery(exteriorData)
        setSelectedGalleryType('Exterior')
        handleObjectIndexChange(1)
        setCurrentImageGalleryMedia(exteriorData?.SubGallery?.[0])
        setSelectedImageIndex(0)
        break

      case 2:
        setGalleryImageLoaded(false)
        setCurrentImageGallery(interiorData)
        setSelectedGalleryType('Interior')
        handleObjectIndexChange(2)
        setCurrentImageGalleryMedia(interiorData?.SubGallery?.[0])
        setSelectedImageIndex(0)
        break

      case 3:
        setGalleryImageLoaded(false)
        setCurrentImageGallery(facilitiesData)
        setSelectedGalleryType('Facilities')
        handleObjectIndexChange(3)
        setCurrentImageGalleryMedia(facilitiesData?.SubGallery?.[0])
        setSelectedImageIndex(0)
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
      const isFacilitiesEmpty = data.AmenitiesGallery?.SubGallery?.every(item => item.Media.data === null) ?? false
      const isExteriorEmpty = data.Gallery?.SubGallery?.every(item => item.Media.data === null) ?? false
      const isInteriorEmpty = data.InteriorGallery?.SubGallery?.every(item => item.Media.data === null) ?? false
      setIsFacilitiesGalleryEmpty(isFacilitiesEmpty)
      setIsInteriorGalleryEmpty(isInteriorEmpty)
      setIsExteriorGalleryEmpty(isExteriorEmpty)
      if (!isExteriorEmpty) {
        setCurrentImageGallery(data.Gallery)
        setCurrentImageGalleryMedia(data.Gallery?.SubGallery?.[0])
        setSelectedObjectIndex(1)
        setSelectedGalleryType('Exterior')
      } else if (!isInteriorEmpty) {
        setCurrentImageGallery(data.InteriorGallery)
        setCurrentImageGalleryMedia(data.InteriorGallery?.SubGallery?.[0])
        setSelectedObjectIndex(2)
        setSelectedGalleryType('Interior')
      } else if (!isFacilitiesEmpty) {
        setCurrentImageGallery(data.AmenitiesGallery)
        setCurrentImageGalleryMedia(data.AmenitiesGallery?.SubGallery?.[0])
        setSelectedObjectIndex(3)
        setSelectedGalleryType('Facilities')
      }
    } else if (data !== undefined && views) {
      const isViewsEmpty = data.ViewsGallery?.SubGallery?.every(item => item.Media.data === null) ?? false
      setIsViewsGalleryEmpty(isViewsEmpty)
      if (!isViewsEmpty) {
        setCurrentImageGalleryMedia(data.ViewsGallery?.SubGallery?.[0])
        setCurrentImageGallery(data.ViewsGallery)
        setSelectedObjectIndex(1)
        setSelectedGalleryType('Exterior')
      }
    }
  }, [data])

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
          ?.map(item => item.attributes.formats?.thumbnail.url ?? '')
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

  return (
    (isFacilitiesGalleryEmpty && isExteriorGalleryEmpty && isInteriorGalleryEmpty && !views) || (views && isViewsGalleryEmpty)
      ? null
      : (
        <section
          id={!views ? 'galleries' : 'views'}
          className='smobile:py-[32px] smobile:px-[16px] tablet:px-[32px] laptop:p-[64px] laptop:h-[min(calc(100vh_-_62px_+_96px),_1200px)] max-w-[2000px] w-full mx-auto'
        >
          <h2 className='smobile:text-[24px] leading-[1] smobile:mb-[32px] laptop:text-[32px] smobile:font-mundialRegular'>
            {!views ? 'Gallery' : 'Views'}
          </h2>
          <div className='flex flex-col w-full relative smobile:h-[calc(100%_-_56px)] laptop:h-[calc(100%_-_64px)]' ref={imageRef}>
            <div className='w-full h-full overflow-hidden'>
              {isFullScreen && (
                <div className='smobile:w-full smobile:px-[16px] smobile:py-[16px] laptop:hidden laptop:h-0'>
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
              {loadingBlur
                ? (
                  <LoaderSpinner
                    width={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex]?.attributes.width ?? undefined}
                    height={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex]?.attributes.height ?? undefined}
                    isPropertyGallery
                  />
                  )
                : (
                    ['Exterior', 'Interior', 'Facilities'].includes(selectedGalleryType) && (
                      <>
                        {(currentImageGalleryMedia as ServerSubGalleryData)?.Media === undefined
                          ? (
                            <Image
                              src='/empty-skeleton.jpg'
                              alt='Gallery image skeleton'
                              width='1093'
                              height='980'
                              style={isFullScreen ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', objectFit: 'contain', width: '100vw', height: '100vh', maxHeight: 'none' } : {}}
                              className={`w-full smobile:max-h-[290px] mobile:max-h-[328px] tablet:max-h-[585px] laptop:max-h-[655px] desktop:max-h-[710px] bdesktop:max-h-[900px] h-full object-cover select-none ${fullScreenTailwindStyles}`}
                            />
                            )
                          : (
                            <>
                              <div style={galleryImageLoaded ? { display: 'none' } : { display: 'block' }}>
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
                                  className={`w-full smobile:max-h-[290px] mobile:max-h-[328px] tablet:max-h-[585px] laptop:max-h-[655px] desktop:max-h-[710px] bdesktop:max-h-[900px] h-full object-cover select-none ${fullScreenTailwindStyles}`}
                                />
                              </div>
                              <Image
                                priority
                                key={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id}
                                onLoad={() => setGalleryImageLoaded(true)}
                                src={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.url !== undefined
                                  ? (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.url ?? ''
                                  : '/empty-skeleton.jpg'}
                                alt='Gallery image'
                                width={
                                  (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.width ?? 1000
                                }
                                height={
                                  (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].attributes.height ?? 900
                                }
                                style={isFullScreen ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', objectFit: 'contain', width: '100vw', height: '100vh', maxHeight: 'none' } : !galleryImageLoaded ? { display: 'none' } : {}}
                                className={`w-full smobile:max-h-[290px] mobile:max-h-[328px] tablet:max-h-[585px] laptop:max-h-[655px] desktop:max-h-[710px] bdesktop:max-h-[900px] h-full object-cover select-none ${fullScreenTailwindStyles}`}
                              />
                            </>
                            )}
                      </>
                    )
                  )}
            </div>
            {!views && (
              <div className={`smobile:hidden smobile:h-0 smobile:w-full smobile:mt-[20px] ${isFullScreen ? 'smobile:hidden smobile:h-0' : ''} laptop:mt-0 laptop:absolute laptop:flex laptop:flex-col laptop:w-full laptop:max-w-[166px] laptop:right-[20px] laptop:top-[20px]`}>
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
                  disabled={interiorData?.SubGallery?.length === 0 || selectedObjectIndex === 2}
                  style={interiorData?.SubGallery?.length === 0 ? { display: 'none', height: '0' } : {}}
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
                {currentFloorData?.attributes.units.data?.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type='button'
                      aria-label='Change unit button'
                      className={`w-[150px] py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 ${item.id === parseInt(unitId) ? 'bg-opacity-100 bg-black text-white' : 'bg-greyButtonsRGBA text-black'} transition-colors duration-200 laptop:w-full laptop:max-w-[166px]`}
                      onClick={() => { onUnitIdChange(item.id) }}
                    >
                      {item.attributes.identifier}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <ul className={`smobile:hidden smobile:h-0 smobile:w-full smobile:pt-[20px] ${isFullScreen ? 'smobile:hidden smobile:h-0 laptop:flex laptop:m-0 laptop:h-auto' : ''} laptop:flex laptop:h-auto laptop:absolute laptop:flex-col laptop:w-full laptop:right-[20px] laptop:m-0 ${views ? 'laptop:top-[20px] laptop:gap-0' : 'laptop:top-[150px] laptop:gap-0'} laptop:max-w-[166px]`}>
              {currentImageGallery?.SubGallery?.map((item, index) => (
                <li key={item.id} style={(item.Media.data === null || item.Media.data.length === 0) ? { display: 'none', height: '0px' } : {}}>
                  <button
                    type='button'
                    aria-label='Change subgallery button'
                    className={`w-full py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 ${item.id === (currentImageGalleryMedia as ServerSubGalleryData)?.id ? 'bg-opacity-100 bg-black text-white' : 'bg-greyButtonsRGBA text-black'} transition-colors duration-200 laptop:w-full laptop:max-w-[166px] disabled:cursor-not-allowed`}
                    onClick={() => { handleSubGalleryMediaChange(index) }}
                    disabled={item.id === (currentImageGalleryMedia as ServerSubGalleryData)?.id}
                  >
                    {item.Name}
                  </button>
                </li>
              ))}
            </ul>
            <div
              style={isFullScreen ? { margin: '0' } : {}}
              className={`smobile:flex smobile:justify-between smobile:absolute smobile:px-[16px] tablet:px-[16px] smobile:bottom-[18px] desktop:bottom-[32px] smobile:w-full ${isFullScreen ? 'smobile:px-[16px] smobile:absolute smobile:bottom-[18px] mobile:bottom-[32px] tablet:bottom-[34px] laptop:px-[20px]' : ''} laptop:absolute laptop:m-0 laptop:bottom-[20px] laptop:px-[20px]`}
            >
              <button
                type='button'
                aria-label='Previous image button'
                disabled={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id === (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[0].id}
                style={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id === (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[0].id ? { opacity: '0', userSelect: 'none', cursor: 'default' } : {}}
                onClick={handleGalleryIndexDown}
                className={`smobile:py-[8px] smobile:px-[8px] laptop:py-[12px] laptop:px-[12px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
              >
                <assets.ChevronLeftSVG
                  width={16}
                  height={16}
                  className='smobile:w-[16px] smobile:h-[16px] laptop:w-[24px] laptop:h-[24px] smobile:stroke-white'
                />
              </button>
              <div className='smobile:flex gap-[8px] items-center'>
                {isFullScreen
                  ? (
                    <button
                      type='button'
                      aria-label='Minimaze content button'
                      onClick={() => {
                        void handleFullScreen()
                      }}
                      className={`smobile:py-[8px] smobile:px-[8px] laptop:py-[12px] laptop:px-[12px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
                    >
                      <assets.MinimazeSVG
                        width={16}
                        height={16}
                        className='smobile:w-[16px] smobile:h-[16px] laptop:w-[24px] laptop:h-[24px] smobile:stroke-white'
                      />
                    </button>
                    )
                  : (
                    <button
                      type='button'
                      aria-label='Maximize content button'
                      onClick={() => {
                        void handleFullScreen()
                      }}
                      className={`smobile:py-[8px] smobile:px-[8px] laptop:py-[12px] laptop:px-[12px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
                    >
                      <assets.MaximizeSVG
                        width={16}
                        height={16}
                        className='smobile:w-[16px] smobile:h-[16px] laptop:w-[24px] laptop:h-[24px] smobile:stroke-white'
                      />
                    </button>
                    )}
                <button
                  type='button'
                  aria-label='Next image button'
                  disabled={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id === (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[((currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.length ?? 1) - 1].id}
                  style={(currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[selectedImageIndex].id === (currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.[((currentImageGalleryMedia as ServerSubGalleryData)?.Media?.data?.length ?? 1) - 1].id ? { display: 'none' } : {}}
                  onClick={handleGalleryIndexRise}
                  className={`smobile:py-[8px] smobile:px-[8px] laptop:py-[12px] laptop:px-[12px] smobile:bg-black smobile:rounded-[50%] ${isFullScreen ? 'border border-white' : ''}`}
                >
                  <assets.ChevronRightSVG
                    width={16}
                    height={16}
                    className='smobile:w-[16px] smobile:h-[16px] laptop:w-[24px] laptop:h-[24px] smobile:stroke-white'
                  />
                </button>
              </div>
            </div>
          </div>
        </section>
        )
  )
}
