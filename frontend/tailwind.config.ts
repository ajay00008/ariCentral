import { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      screens: {
        smobile: '375px',
        mobile: '428px',
        tablet: '768px',
        laptop: '1280px',
        desktop: '1440px',
        bdesktop: '1728px'
      },
      borderColor: {
        greyCustom: '#808080',
        greySeparator: '#B2B2B2',
        greyBreakup: '#C8C8C8',
        greyAccountTablet: '#C6C8CC',
        greyAccount: '#9EA0A4'
      },
      transform: {
        'translate-center': 'translate(-50%, -50%)'
      },
      boxShadow: {
        customThumb: '0px 2px 5px rgba(0, 0, 0, 0.25)'
      },
      fontFamily: {
        mundialBlack: ['var(--font-mundial-b)'],
        mundialThin: ['var(--font-mundial-thin)'],
        mundialLight: ['var(--font-mundial-light)'],
        mundialRegular: ['var(--font-mundial-regular)'],
        mundialDemiBold: ['var(--font-mundial-demibold)'],
        mundialBold: ['var(--font-mundial-bold)']
      },
      backgroundColor: {
        grey: '#F0F0F0',
        highGrey: '#E5E5E5',
        red: '#e60000',
        orange: '#ec7425',
        green: '#00b400',
        primaryBlack: '#000000',
        secondaryBlack: '#191919',
        greyButtonsRGBA: 'rgba(241, 245, 249, 0.8)',
        greyRGBA: 'rgba(240, 240, 240, 0.2)',
        redRGBA: 'rgba(230, 0, 0, 0.2)',
        orangeRGBA: 'rgba(236, 116, 37, 0.2)',
        greenRGBA: 'rgba(0, 180, 0, 0.2)',
        customGreyRGBA: 'rgb(240 240 240 / 1)',
        updatedGrey: '#DDE1E5',
        unitGreen: '#00B400',
        unitOrange: '#EC7425',
        unitRed: '#D30003',
        dropdownWhite: '#F1F5F9',
        comissionGrey: '#E6E6E6',
        heroBreakLineBg: '#B2B2B2',
        summaryBreakLineBg: '#C8C8C8',
        summaryOddTextBackground: '#ECF0F4',
        customBlack: '#464646',
        customBlackRGBA: 'rgba(0, 0, 0, 0.6)'
      },
      textColor: {
        grey: '#F0F0F0',
        red: '#e60000',
        orange: '#ec7425',
        green: '#00b400',
        customWhite: '#ffffff',
        customGrey: '#464646',
        customHalfGrey: '#8C8C8C',
        customBlack: '#231F20',
        nativeBlack: '#000000',
        customTextBlack: '#141414',
        customFAQHalfBlack: '#16201C',
        customSignUpBlack: '#0A0A0A',
        customParagraphMarkdown: '#221C1A',
        customGreyAccount: '#808080'
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config
