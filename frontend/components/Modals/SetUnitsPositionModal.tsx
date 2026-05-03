'use client'

import * as React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { generateId } from '@/lib/generator'
import { heroImages } from '@/lib/hero-images'

interface SetUnitsPositionModalProps {
  data: StrapiPropertyProperty
  disabled: boolean
  onChange: (val: StrapiFloorFloor[]) => unknown
}

export function SetUnitsPositionModal ({ data, disabled, onChange }: SetUnitsPositionModalProps): React.ReactNode {
  const [imageIdx, setImageIdx] = React.useState(0)
  const imageRef = React.useRef<HTMLImageElement | null>(null)
  const dataHeroImages = heroImages(data.attributes)

  function handleDrag (e: React.DragEvent<HTMLElement>, id: number): void {
    e.dataTransfer.setData('id', id.toString())
  }

  function handleDragOver (e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault()
  }

  function handleDrop (e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault()

    const unitId = Number.parseInt(e.dataTransfer.getData('id'), 10)
    const dragUnit = units.find((unit) => unit.id === unitId)

    if (dragUnit === undefined || imageRef.current === null) {
      return
    }

    const size = 10
    const { height: h, left, top, width: w } = imageRef.current.getBoundingClientRect()
    const cx = e.clientX - left
    const cy = e.clientY - top

    const ax = Math.round(cx / size) * size + size / 5
    const ay = Math.round(cy / size) * size + size / 5

    const rx = ax * 100 / w - 50
    const ry = ay * 100 / h - 50

    const shouldRemove = Math.abs(rx) > 49 || Math.abs(ry) > 49

    onChange(
      data.attributes.floors.data.map((floor) => ({
        ...floor,
        attributes: {
          ...floor.attributes,
          units: {
            ...floor.attributes.units,
            data: floor.attributes.units.data.map((unit) => {
              if (unit.id !== dragUnit.id) {
                return unit
              }

              const positionImageIdx = unit.attributes.positions.findIndex((position) => position.imageId === imageIdx)

              const newPositions = shouldRemove
                ? []
                : [{
                    id: positionImageIdx === -1 ? generateId() : unit.attributes.positions[positionImageIdx].id,
                    imageId: imageIdx,
                    x: rx,
                    y: ry
                  }]

              return {
                ...unit,
                attributes: {
                  ...unit.attributes,
                  positions: positionImageIdx === -1
                    ? [
                        ...unit.attributes.positions,
                        ...newPositions
                      ]
                    : [
                        ...unit.attributes.positions.slice(0, positionImageIdx),
                        ...newPositions,
                        ...unit.attributes.positions.slice(positionImageIdx + 1)
                      ]
                }
              }
            })
          }
        }
      }))
    )
  }

  const handleImageRef = React.useCallback((node: HTMLImageElement) => {
    imageRef.current = node
    handleUpdate()
  }, [])

  const handleUpdate = React.useCallback(() => {
    const currentImage = dataHeroImages[imageIdx]?.Image.data ?? null

    if (currentImage === null || imageRef.current === null) {
      return
    }

    const image = imageRef.current
    const parentContainerWidth = window.innerWidth - 50
    const containerWidth = parentContainerWidth - (parentContainerWidth * 1 / 6) - 8
    const containerHeight = window.innerHeight - 130

    const containerRatio = containerWidth / containerHeight
    const imageRatio = (currentImage.attributes.width ?? 0) / (currentImage.attributes.height ?? 0)

    if (containerRatio > imageRatio) {
      image.style.width = `${containerHeight * imageRatio}px`
      image.style.height = `${containerHeight}px`
    } else {
      image.style.width = `${containerWidth}px`
      image.style.height = `${containerWidth / imageRatio}px`
    }
  }, [imageIdx])

  React.useEffect(() => {
    window.addEventListener('resize', handleUpdate)
    return () => window.addEventListener('resize', handleUpdate)
  }, [handleUpdate])

  React.useEffect(() => {
    handleUpdate()
  }, [imageIdx, handleUpdate])

  function handleToggle (open: boolean): void {
    if (!open) {
      setImageIdx(0)
    }
  }

  const units = data.attributes.floors.data.map((floor) => floor.attributes.units.data).flat()

  return (
    <Dialog onOpenChange={handleToggle}>
      <DialogTrigger asChild>
        <Button className='mt-auto mb-0 flex' disabled={disabled}>
          Place Units
        </Button>
      </DialogTrigger>
      <DialogContent
        className='max-w-none w-full h-full sm:rounded-none flex flex-col'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <DialogHeader>
          <DialogTitle>Units Placement Widget</DialogTitle>
          <DialogDescription>
            Here you can set position of units for hero section images. Start with dragging a unit on top of the image.<br />
            To remove a unit from the image, just drag it outside of the image.
          </DialogDescription>
        </DialogHeader>
        <div className='flex gap-2'>
          <div className='flex flex-col gap-1 w-1/6 shrink-0'>
            {units.map((unit) => {
              const statusColor = unit.attributes.status === 'AVAILABLE'
                ? 'text-emerald-400'
                : unit.attributes.status === 'SOLD'
                  ? 'text-rose-600'
                  : unit.attributes.status === 'RESERVED'
                    ? 'text-yellow-600'
                    : ''

              return (
                <button
                  key={unit.id}
                  className='border flex justify-between border-zinc-200 p-2 hover:cursor-pointer items-center rounded-lg'
                  disabled={disabled}
                  draggable
                  onDragStart={(e) => handleDrag(e, unit.id)}
                >
                  <p className={statusColor}>
                    {unit.attributes.status.slice(0, 1)}{unit.attributes.status.slice(1).toLowerCase()}
                  </p>
                  <p className='text-black text-lg text-nowrap text-ellipsis overflow-hidden max-w-[174px] ml-[10px]'>
                    {unit.attributes.identifier}
                  </p>
                </button>
              )
            })}
          </div>
          {dataHeroImages.length > 0 && (
            <div className='relative'>
              <div className='relative h-fit w-fit'>
                <div className='relative border border-zinc-200 rounded-md h-fit w-fit overflow-hidden'>
                  <Image
                    alt='Property image'
                    className='select-none pointer-events-none'
                    draggable={false}
                    height={dataHeroImages[imageIdx].Image.data.attributes.width ?? undefined}
                    src={dataHeroImages[imageIdx].Image.data.attributes.url}
                    ref={handleImageRef}
                    width={dataHeroImages[imageIdx].Image.data.attributes.width ?? undefined}
                  />
                </div>
                <div className='flex flex-col gap-3 absolute right-4 top-4'>
                  {dataHeroImages.map((heroImage, idx) => (
                    <button
                      key={heroImage.Image.data.attributes.url}
                      className='opacity-40 enabled:hover:opacity-60 disabled:opacity-100 border border-white transition duration-200'
                      disabled={idx === imageIdx}
                      onClick={() => setImageIdx(idx)}
                      type='button'
                    >
                      <Image
                        alt='Property image'
                        className='select-none pointer-events-none w-24'
                        draggable={false}
                        height={heroImage.Image.data.attributes.width ?? undefined}
                        src={heroImage.Image.data.attributes.url}
                        width={heroImage.Image.data.attributes.width ?? undefined}
                      />
                    </button>
                  ))}
                </div>
                {units.map((unit) => {
                  const position = unit.attributes.positions.find((position) => position.imageId === imageIdx)

                  if (position === undefined) {
                    return null
                  }

                  const statusColor = unit.attributes.status === 'AVAILABLE'
                    ? 'bg-emerald-400'
                    : unit.attributes.status === 'SOLD'
                      ? 'bg-rose-600'
                      : unit.attributes.status === 'RESERVED'
                        ? 'bg-yellow-600'
                        : ''

                  return (
                    <div
                      key={unit.id}
                      className='absolute group flex select-none'
                      style={{
                        left: `calc(50% + ${position.x}% - 5px)`,
                        top: `calc(50% + ${position.y}% - 5px)`
                      }}
                    >
                      <button
                        className={`w-[10px] h-[10px] rounded-full ${statusColor}`}
                        disabled={disabled}
                        draggable
                        onDragStart={(e) => handleDrag(e, unit.id)}
                      />
                      <div className='group-hover:block hidden bg-gray-800 text-white px-2 py-1 rounded-md -translate-x-1/2 absolute whitespace-nowrap left-1/2 top-5 text-sm'>
                        Unit {unit.attributes.identifier}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
