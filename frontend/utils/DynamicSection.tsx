'use client'

import { parseISO, format } from 'date-fns'
import { useMediaQuery } from 'react-responsive'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface Props {
  data: ActionGetDynamicPageBySlug
}

export function DynamicSection ({ data }: Props): React.ReactNode {
  const date = parseISO(data.Date)
  const formattedDate = format(date, 'MMMM dd, yyyy')
  const isBDesktopScreen = useMediaQuery({ query: '(min-width: 1728px)' })
  const isDesktopScreen = useMediaQuery({ query: '(min-width: 1440px) and (max-width: 1727px)' })
  const isLaptopScreen = useMediaQuery({ query: '(min-width: 1280px) and (max-width: 1439px)' })
  const isTabletScreen = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1279px)' })
  const isMobileScreen = useMediaQuery({ query: '(min-width: 375px) and (max-width: 767px)' })
  const inlineMarkdownStyles = isBDesktopScreen
    ? { maxWidth: '51%', marginRight: '272px' }
    : isDesktopScreen
      ? { maxWidth: '50%', marginRight: '272px' }
      : isLaptopScreen
        ? { maxWidth: '54%', marginRight: '175px' }
        : {}
  const headingStyles = isDesktopScreen
    ? { paddingTop: '55px', paddingBottom: '55px' }
    : isTabletScreen
      ? { paddingTop: '58px', paddingBottom: '58px' }
      : isMobileScreen
        ? { paddingTop: '42px', paddingBottom: '42px' }
        : {}
  const wrapperStyles = isBDesktopScreen
    ? { marginBottom: '48.5px' }
    : isDesktopScreen
      ? { marginBottom: '38.5px' }
      : isLaptopScreen
        ? { marginBottom: '78px' }
        : isTabletScreen
          ? { marginBottom: '64px' }
          : isMobileScreen
            ? { marginBottom: '47px' }
            : {}

  return (
    <section className='mx-auto laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px] w-full h-auto'>
      <div className='smobile:flex smobile:px-[16px] tablet:px-[32px] desktop:px-[64px] smobile:flex-col smobile:gap-[48px] tablet:gap-[64px] laptop:gap-[68px] desktop:gap-[64px] bdesktop:gap-[68px' style={wrapperStyles}>
        <div className='smobile:flex smobile:py-[48px] tablet:py-[65px] border-b border-[#D1D1D1]' style={headingStyles}>
          <h2 className='smobile:font-mundialRegular smobile:text-[40px] smobile:max-w-[270px] smobile:overflow-hidden smobile:text-ellipsis desktop:text-[56px] smobile:leading-[1] smobile:text-black'>
            {data.Name}
          </h2>
        </div>
        <div className='smobile:flex smobile:flex-col smobile:gap-[48px] laptop:flex-row laptop:justify-between'>
          <div className='smobile:flex smobile:flex-col smobile:gap-[5px]'>
            <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey' style={{ opacity: '60%' }}>Updated</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-nowrap smobile:text-customFAQHalfBlack'>
              {formattedDate}
            </p>
          </div>
          <div
            className='w-full laptop:max-w-[54%] desktop:max-w-[50%] bdesktop:max-w-[41%] laptop:mr-[175px] desktop:mr-[272px] markdown'
            style={inlineMarkdownStyles}
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {data.Content}
            </Markdown>
          </div>
        </div>
      </div>
    </section>
  )
}
