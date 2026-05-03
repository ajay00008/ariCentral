import { Poppins, Rubik } from 'next/font/google'
import local from 'next/font/local'

export const mundialB = local({
  src: [
    {
      path: '../public/fonts/Mundial-Black.otf',
      weight: '900'
    }
  ],
  variable: '--font-mundial-b'
})

export const mundialBItalic = local({
  src: [
    {
      path: '../public/fonts/Mundial-BlackItalic.otf',
      weight: '900'
    }
  ],
  variable: '--font-mundial-b-italic'
})

export const mundialBold = local({
  src: [
    {
      path: '../public/fonts/Mundial-Bold.otf',
      weight: '700'
    }
  ],
  variable: '--font-mundial-bold'
})

export const mundialBoldItalic = local({
  src: [
    {
      path: '../public/fonts/Mundial-BoldItalic.otf',
      weight: '700'
    }
  ],
  variable: '--font-mundial-bold-italic'
})

export const mundialDemibold = local({
  src: [
    {
      path: '../public/fonts/Mundial-Demibold.otf',
      weight: '600'
    }
  ],
  variable: '--font-mundial-demibold'
})

export const mundialDemiboldItalic = local({
  src: [
    {
      path: '../public/fonts/Mundial-DemiboldItalic.otf',
      weight: '600'
    }
  ],
  variable: '--font-mundial-demibold-italic'
})

export const mundialHair = local({
  src: [
    {
      path: '../public/fonts/Mundial-Hair.otf',
      weight: '200'
    }
  ],
  variable: '--font-mundial-hair'
})

export const mundialHairItalic = local({
  src: [
    {
      path: '../public/fonts/Mundial-HairItalic.otf',
      weight: '200'
    }
  ],
  variable: '--font-mundial-hair-italic'
})

export const mundialItalic = local({
  src: [
    {
      path: '../public/fonts/Mundial-Italic.otf',
      weight: '400'
    }
  ],
  variable: '--font-mundial-italic'
})

export const mundialLight = local({
  src: [
    {
      path: '../public/fonts/Mundial-Light.otf',
      weight: '300'
    }
  ],
  variable: '--font-mundial-light'
})

export const mundialLightItalic = local({
  src: [
    {
      path: '../public/fonts/Mundial-LightItalic.otf',
      weight: '300'
    }
  ],
  variable: '--font-mundial-light-italic'
})

export const mundialRegular = local({
  src: [
    {
      path: '../public/fonts/Mundial-Regular.otf',
      weight: '400'
    }
  ],
  variable: '--font-mundial-regular'
})

export const mundialThin = local({
  src: [
    {
      path: '../public/fonts/Mundial-Thin.otf',
      weight: '100'
    }
  ],
  variable: '--font-mundial-thin'
})

export const mundialThinItalic = local({
  src: [
    {
      path: '../public/fonts/Mundial-ThinItalic.otf',
      weight: '100'
    }
  ],
  variable: '--font-mundial-thin-italic'
})

export const poppins = Poppins({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700']
})

export const rubik = Rubik({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-rubik',
  weight: ['400', '500', '600', '700']
})
