'use client'

import * as React from 'react'
import Pica from 'pica'
import { Image, DocumentProps } from '@react-pdf/renderer'

interface Props {
  imageUrl: string
  styleClass: DocumentProps['style']
  isEmpty?: boolean
}

export function PDFImageComponent ({ imageUrl, styleClass, isEmpty }: Props): React.ReactNode {
  const [convertedSrc, setConvertedSrc] = React.useState<string | null>(null)
  const stylesClasses = styleClass as { objectFit?: string }
  if (isEmpty !== undefined) {
    delete stylesClasses.objectFit
    stylesClasses.objectFit = 'cover'
  }

  async function convertImageToJPEG (imageUrl: string): Promise<string | null> {
    try {
      const img = new window.Image()
      img.crossOrigin = 'Anonymous'
      img.src = imageUrl

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.drawImage(img, 0, 0)

      const pica = Pica()
      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = img.width
      outputCanvas.height = img.height

      await pica.resize(canvas, outputCanvas)

      const jpegBase64 = outputCanvas.toDataURL('image/jpeg', 1.0)
      return jpegBase64
    } catch (err) {
      return null
    }
  }

  React.useEffect(() => {
    async function convertImage (): Promise<void> {
      const base64String = await convertImageToJPEG(imageUrl)
      if (base64String === null) {
        throw new Error("Couldn't convert image to JPEG")
      }
      setConvertedSrc(base64String)
    }

    void convertImage()
  }, [imageUrl])

  return (
    <Image
      source={{
        uri: convertedSrc ?? '/empty-skeleton.jpg',
        method: 'GET',
        body: null,
        headers: {}
      }}
      style={stylesClasses}
    />
  )
}
