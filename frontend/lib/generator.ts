let lastId = 2_000_000_000

export function generateId (): number {
  return ++lastId
}

export function generateDownload (): StrapiSharedDownload {
  return {
    id: generateId(),
    downloadName: '',
    downloadFile: {
      data: null
    },
    Icon: 'Image'
  }
}

export function generateFloor (units: StrapiUnitUnit[] = []): StrapiFloorFloor {
  return {
    id: generateId(),
    attributes: {
      identifier: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      units: {
        data: units
      }
    }
  }
}

export function generateListItem (item: string): NonNullable<StrapiSharedList['Items']>[number] {
  return {
    id: generateId(),
    Item: item
  }
}

export function generateSubGallery (): StrapiSharedSubGallery {
  return {
    id: generateId(),
    Name: '',
    Media: {
      data: []
    }
  }
}

export function generatePropertyHero (asset: StrapiMedia): StrapiSharedPropertyHero {
  return {
    id: generateId(),
    Name: '',
    Image: {
      data: asset
    }
  }
}

export function generateUnit (order: number | null = null): StrapiUnitUnit {
  return {
    id: generateId(),
    attributes: {
      identifier: '',
      externalSize: null,
      internalSize: null,
      cars: null,
      powder: null,
      order,
      status: 'AVAILABLE',
      aspect: 'SOUTH',
      type: 'TOWNHOUSE',
      price: null,
      beds: null,
      baths: null,
      bodyCorp: null,
      rentApp: null,
      rates: null,
      living: null,
      positions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      unitPlan: {
        data: null
      },
      unitGallery: {
        data: null
      }
    }
  }
}
