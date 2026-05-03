declare module 'react-range-slider-input' {
  type Orientation = 'vertical' | 'horizontal'
  type Step = number | 'any'

  export default function RangeSlider (props: RangeSliderProps): React.ReactNode

  export interface RangeSliderProps {
    min?: number
    max?: number
    step?: Step
    value?: [number, number] | number[]
    defaultValue?: [number, number]
    onInput?: (value: [number, number], userInteraction: boolean) => void
    onThumbDragStart?: () => void
    onThumbDragEnd?: () => void
    onRangeDragStart?: () => void
    onRangeDragEnd?: () => void
    disabled?: boolean
    rangeSlideDisabled?: boolean
    thumbsDisabled?: [boolean, boolean]
    orientation?: Orientation
    className?: string
    id?: string
  }
}
