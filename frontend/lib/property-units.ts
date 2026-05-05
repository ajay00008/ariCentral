export function getPropertyFloors (data: Pick<ActionGetPropertyBySlug, 'floors'> | null | undefined): Floor[] {
  return data?.floors?.data ?? []
}

export function getFloorUnits (floor: Floor | null | undefined): CustomUnit[] {
  return floor?.attributes?.units?.data ?? []
}

export function getPropertyUnits (data: Pick<ActionGetPropertyBySlug, 'floors'> | null | undefined): CustomUnit[] {
  return getPropertyFloors(data).flatMap(getFloorUnits)
}
