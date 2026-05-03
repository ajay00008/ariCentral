'use client'

import * as React from 'react'
import { Accordion } from './Accordion'

interface Props {
  unitData: CustomUnit | undefined
  currency: Currency
  unitId: number | null
  currentTab: string
  currentFloorData: Floor | undefined
  onUnitIdChange: (unitId: number) => void
}

export function UnitDetailsSummaryAccordion ({
  unitData,
  unitId,
  onUnitIdChange,
  currency,
  currentFloorData,
  currentTab
}: Props): React.ReactNode {
  const [activeDialogue, setActiveDialogue] = React.useState<number>(0)

  function handleDialogue (index: number): void {
    if (index === activeDialogue) return setActiveDialogue(3)
    setActiveDialogue(index)
  }

  return (
    <>
      <Accordion
        unitData={unitData}
        variant={1}
        activeDialogue={activeDialogue === 0}
        currency={currency}
        handleDialogue={handleDialogue}
        onUnitIdChange={onUnitIdChange}
        unitId={unitId}
        currentFloorData={currentFloorData}
        currentTab={currentTab}
      />
      <Accordion
        unitData={unitData}
        variant={2}
        activeDialogue={activeDialogue === 1}
        handleDialogue={handleDialogue}
        currency={currency}
        onUnitIdChange={onUnitIdChange}
        unitId={unitId}
        currentFloorData={currentFloorData}
        currentTab={currentTab}
      />
      <Accordion
        unitData={unitData}
        variant={3}
        activeDialogue={activeDialogue === 2}
        handleDialogue={handleDialogue}
        currency={currency}
        onUnitIdChange={onUnitIdChange}
        unitId={unitId}
        currentFloorData={currentFloorData}
        currentTab={currentTab}
      />
    </>
  )
}
