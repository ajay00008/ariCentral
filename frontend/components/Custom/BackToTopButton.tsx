import * as React from 'react'
import assets from '@/assets'

export function BackToTopButton (): React.ReactNode {
  const [isVisible, setIsVisible] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const visibleStyle = isVisible ? 'flex' : 'hidden'

  function handleScroll (): void {
    const scrollTop = document.documentElement.scrollTop !== null
      ? document.documentElement.scrollTop
      : document.body.scrollTop
    setIsVisible(scrollTop > 200)
  }

  function scrollToTop (): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    if (buttonRef.current === null) return
    buttonRef.current.blur()
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <button
      type='button'
      aria-label='Back to top'
      ref={buttonRef}
      className={`fixed ${visibleStyle} bg-black smobile:bottom-[16px] smobile:right-[16px] tablet:bottom-[32px] tablet:right-[32px] laptop:bottom-[32px] laptop:right-[64px] z-20 opacity-30 hover:opacity-50 font-bold py-2 px-4 rounded transition duration-200 ease-in-out`}
      onClick={scrollToTop}
    >
      <assets.ArrowVectorUpSVG width={32} height={32} className='fill-white' />
    </button>
  )
}
