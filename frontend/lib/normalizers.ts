export const mediaNormalizer = {
  normalizeMedia: (media: unknown): StrapiMedia | null => {
    if (media === null || media === undefined || typeof media !== 'object') return null

    const mediaObj = media as Record<string, unknown>
    const attributes = (mediaObj.attributes !== undefined && mediaObj.attributes !== null
      ? mediaObj.attributes
      : {}) as Record<string, unknown>

    return {
      id: !isNaN(Number(mediaObj.id)) ? Number(mediaObj.id) : 0,
      attributes: {
        name: String(mediaObj.name ?? attributes.name ?? ''),
        alternativeText: mediaObj.alternativeText !== undefined && mediaObj.alternativeText !== null
          ? String(mediaObj.alternativeText)
          : attributes.alternativeText !== undefined && attributes.alternativeText !== null
            ? String(attributes.alternativeText)
            : null,
        caption: mediaObj.caption !== undefined && mediaObj.caption !== null
          ? String(mediaObj.caption)
          : attributes.caption !== undefined && attributes.caption !== null
            ? String(attributes.caption)
            : null,
        width: mediaObj.width !== undefined && mediaObj.width !== null
          ? Number(mediaObj.width)
          : attributes.width !== undefined && attributes.width !== null
            ? Number(attributes.width)
            : null,
        height: mediaObj.height !== undefined && mediaObj.height !== null
          ? Number(mediaObj.height)
          : attributes.height !== undefined && attributes.height !== null
            ? Number(attributes.height)
            : null,
        formats: (mediaObj.formats !== undefined && mediaObj.formats !== null
          ? { thumbnail: { url: String((mediaObj.formats as any)?.thumbnail?.url ?? '') } }
          : attributes.formats !== undefined && attributes.formats !== null
            ? { thumbnail: { url: String((attributes.formats as any)?.thumbnail?.url ?? '') } }
            : null),
        hash: String(mediaObj.hash ?? attributes.hash ?? ''),
        ext: String(mediaObj.ext ?? attributes.ext ?? ''),
        mime: String(mediaObj.mime ?? attributes.mime ?? ''),
        size: Number(mediaObj.size ?? attributes.size ?? 0),
        url: String(mediaObj.url ?? attributes.url ?? ''),
        previewUrl: mediaObj.previewUrl !== undefined && mediaObj.previewUrl !== null
          ? String(mediaObj.previewUrl)
          : attributes.previewUrl !== undefined && attributes.previewUrl !== null
            ? String(attributes.previewUrl)
            : null,
        provider: String(mediaObj.provider ?? attributes.provider ?? ''),
        provider_metadata: (mediaObj.provider_metadata !== undefined && mediaObj.provider_metadata !== null
          ? mediaObj.provider_metadata
          : attributes.provider_metadata !== undefined && attributes.provider_metadata !== null
            ? attributes.provider_metadata
            : null) as Object | null,
        createdAt: String(mediaObj.createdAt ?? attributes.createdAt ?? ''),
        updatedAt: String(mediaObj.updatedAt ?? attributes.updatedAt ?? '')
      }
    }
  },

  normalizeMediaArray: (mediaArray: unknown[]): StrapiMedia[] => {
    if (!Array.isArray(mediaArray)) return []
    return mediaArray.map(mediaNormalizer.normalizeMedia).filter((item): item is StrapiMedia => item !== null)
  }
}

const normalizeStrapiMedia = (media: unknown): StrapiMedia => {
  const normalized = mediaNormalizer.normalizeMedia(media)
  if (normalized === null) {
    throw new Error('Media normalization failed: null value encountered')
  }
  return normalized
}

export const heroNormalizer = {
  normalizeHeroImage: (heroImage: unknown): { data: StrapiMedia[] | null } => {
    if (heroImage === null || heroImage === undefined) return { data: null }

    if (typeof heroImage === 'object' && heroImage !== null && 'data' in heroImage) {
      const hero = heroImage as { data: unknown }
      if (hero.data === null) return { data: null }
      if (Array.isArray(hero.data)) {
        return { data: hero.data.map(normalizeStrapiMedia) }
      }
      return { data: [normalizeStrapiMedia(hero.data)] }
    }

    if (Array.isArray(heroImage)) {
      return { data: heroImage.map(normalizeStrapiMedia) }
    }

    if (typeof heroImage === 'object' && heroImage !== null && 'id' in heroImage) {
      return { data: [normalizeStrapiMedia(heroImage)] }
    }

    return { data: null }
  },

  normalizeHeroImages: (heroImages: unknown): StrapiSharedPropertyHero[] => {
    if (!Array.isArray(heroImages)) return []

    return heroImages.map((item: unknown) => {
      const itemObj = item as Record<string, unknown>
      const id = typeof itemObj.id === 'number' ? itemObj.id : 0
      const name = typeof itemObj.Name === 'string' ? itemObj.Name : ''

      if ('Image' in itemObj && typeof itemObj.Image === 'object' && itemObj.Image !== null && 'data' in itemObj.Image) {
        const imageData = (itemObj.Image as { data: unknown }).data
        return {
          id,
          Name: name,
          Image: {
            data: normalizeStrapiMedia(imageData)
          }
        }
      }
      const imageData = 'Image' in itemObj
        ? itemObj.Image
        : 'image' in itemObj
          ? itemObj.image
          : itemObj
      return {
        id,
        Name: name,
        Image: {
          data: normalizeStrapiMedia(imageData)
        }
      }
    })
  }
}

export const galleryNormalizer = {
  normalizeGallery: (gallery: unknown): {
    Name: string
    id: number
    SubGallery: ServerSubGalleryData[]
  } => {
    if (typeof gallery !== 'object' || gallery === null) {
      return {
        Name: '',
        id: 0,
        SubGallery: []
      }
    }

    const galleryObj = gallery as Record<string, unknown>
    const name = typeof galleryObj.name === 'string'
      ? galleryObj.name
      : typeof galleryObj.Name === 'string' ? galleryObj.Name : ''
    const id = typeof galleryObj.id === 'number' ? galleryObj.id : 0

    return {
      Name: name,
      id,
      SubGallery: Array.isArray(galleryObj.SubGallery)
        ? (galleryObj.SubGallery as unknown[]).map((sub: unknown) => {
            if (typeof sub !== 'object' || sub === null) {
              return {
                Name: '',
                id: 0,
                Media: { data: null }
              }
            }
            const subObj = sub as Record<string, unknown>
            return {
              Name: typeof subObj.Name === 'string' ? subObj.Name : '',
              id: typeof subObj.id === 'number' ? subObj.id : 0,
              Media: {
                data: subObj.Media !== null && subObj.Media !== undefined
                  ? mediaNormalizer.normalizeMediaArray(subObj.Media as unknown[])
                  : null
              }
            }
          })
        : []
    }
  }
}

export const unitNormalizer = {
  normalizeUnit: (unit: unknown, floorId: number, floorIdentifier: string): CustomUnit => {
    if (typeof unit !== 'object' || unit === null) {
      return {
        id: 0,
        attributes: {
          status: '',
          type: '',
          aspect: '',
          beds: '',
          baths: '',
          cars: 0,
          powder: 0,
          price: 0,
          commission: 0,
          bodyCorp: 0,
          rentApp: 0,
          rates: 0,
          living: 0,
          internalSize: 0,
          externalSize: 0,
          identifier: '',
          order: 0,
          unitPlan: { data: null },
          unitGallery: { data: [] },
          floor: {
            data: {
              id: floorId,
              attributes: {
                identifier: floorIdentifier
              }
            }
          },
          positions: []
        }
      }
    }

    const unitObj = unit as Record<string, unknown>
    const getNumber = (value: unknown, defaultValue = 0): number =>
      typeof value === 'number' ? value : defaultValue
    const getString = (value: unknown, defaultValue = ''): string =>
      typeof value === 'string' ? value : defaultValue

    return {
      id: getNumber(unitObj.id),
      attributes: {
        status: getString(unitObj.status),
        type: getString(unitObj.type),
        aspect: getString(unitObj.aspect),
        beds: getString(unitObj.beds),
        baths: getString(unitObj.baths),
        cars: getNumber(unitObj.cars),
        powder: getNumber(unitObj.powder),
        price: getNumber(unitObj.price),
        commission: getNumber(unitObj.commission),
        bodyCorp: getNumber(unitObj.bodyCorp),
        rentApp: getNumber(unitObj.rentApp),
        rates: getNumber(unitObj.rates),
        living: getNumber(unitObj.living),
        internalSize: getNumber(unitObj.internalSize),
        externalSize: getNumber(unitObj.externalSize),
        identifier: getString(unitObj.identifier),
        order: getNumber(unitObj.order),
        unitPlan: {
          data: unitObj.unitPlan !== null && unitObj.unitPlan !== undefined
            ? mediaNormalizer.normalizeMedia(unitObj.unitPlan)
            : null
        },
        unitGallery: {
          data: unitObj.unitGallery !== null && unitObj.unitGallery !== undefined
            ? mediaNormalizer.normalizeMediaArray(unitObj.unitGallery as unknown[])
            : []
        },
        floor: {
          data: {
            id: floorId,
            attributes: {
              identifier: floorIdentifier
            }
          }
        },
        positions: Array.isArray(unitObj.positions) ? unitObj.positions : []
      }
    }
  }
}

export const floorNormalizer = {
  normalizeFloor: (floor: unknown): Floor => {
    if (typeof floor !== 'object' || floor === null) {
      return {
        id: 0,
        attributes: {
          identifier: '',
          units: {
            data: []
          }
        }
      }
    }

    const floorObj = floor as Record<string, unknown>
    const floorId = Number(floorObj.id)
    const identifier = typeof floorObj.identifier === 'string' ? floorObj.identifier : ''

    return {
      id: !isNaN(floorId) ? floorId : 0,
      attributes: {
        identifier,
        units: {
          data: Array.isArray(floorObj.units)
            ? (floorObj.units as unknown[]).map((unit: unknown) =>
                unitNormalizer.normalizeUnit(
                  unit,
                  !isNaN(floorId) ? floorId : 0,
                  identifier
                ))
            : []
        }
      }
    }
  }
}

export const listNormalizer = {
  normalizePropertyList: (list: unknown): PropertyList => {
    if (typeof list !== 'object' || list === null) {
      return {
        id: 0,
        Identifier: '',
        Items: []
      }
    }

    const listObj = list as Record<string, unknown>
    const listId = Number(listObj.id)
    const identifier = typeof listObj.Identifier === 'string' ? listObj.Identifier : ''

    return {
      id: !isNaN(listId) ? listId : 0,
      Identifier: identifier,
      Items: Array.isArray(listObj.Items)
        ? (listObj.Items as unknown[]).map((item: unknown) => {
            if (typeof item !== 'object' || item === null) {
              return { id: 0, Item: '' }
            }

            const itemObj = item as Record<string, unknown>
            const itemId = Number(itemObj.id)
            const itemValue = typeof itemObj.Item === 'string' ? itemObj.Item : ''

            return {
              id: !isNaN(itemId) ? itemId : 0,
              Item: itemValue
            }
          })
        : []
    }
  }
}

export const downloadNormalizer = {
  normalizeDownloads: (downloads: unknown[]): DownloadsItem[] => {
    if (!Array.isArray(downloads)) return []

    return downloads.map(download => {
      if (typeof download !== 'object' || download === null) {
        return {
          id: 0,
          Icon: '',
          downloadName: '',
          downloadFile: { data: null }
        }
      }

      const downloadObj = download as Record<string, unknown>
      const id = Number(downloadObj.id)
      const icon = typeof downloadObj.Icon === 'string' ? downloadObj.Icon : ''
      const name = typeof downloadObj.downloadName === 'string' ? downloadObj.downloadName : ''
      const file = downloadObj.downloadFile

      return {
        id: !isNaN(id) ? id : 0,
        Icon: icon,
        downloadName: name,
        downloadFile: {
          data:
            typeof file === 'object' && file !== null
              ? mediaNormalizer.normalizeMedia(file)
              : null
        }
      }
    })
  }
}
