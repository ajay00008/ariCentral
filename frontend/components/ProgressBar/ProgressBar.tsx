'use client'

interface Props {
  percentage: number
  isAuth?: boolean
}

export function ProgressBar ({ percentage, isAuth }: Props): React.ReactNode {
  const progressBarStyle = {
    width: `${percentage}%`
  }
  const progressBarAuthStyle = isAuth !== undefined ? 'fixed top-[0.5%] left-[50%] max-w-[445px] overflow-hidden rounded-lg tablet:translate-center z-[100]' : ''

  return (
    <div className={`w-full bg-grey ${progressBarAuthStyle}`}>
      <div style={progressBarStyle} className='h-[4px] bg-orange transition-all duration-200' />
    </div>
  )
}
