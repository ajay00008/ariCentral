interface HeroImagesData {
  HeroImage:
  | { data: StrapiMedia[] | null }
  | StrapiMedia[]
  | Array<Omit<StrapiMedia, 'attributes'> & StrapiMedia['attributes']>
  | null
  HeroImages:
  StrapiSharedPropertyHero[]
  | Array<
  Omit<StrapiSharedPropertyHero, 'Image'> & {
    Image: (Omit<StrapiMedia, 'attributes'> & StrapiMedia['attributes']) | null
  }
  >
}

export function heroImages (property: HeroImagesData | null | undefined): StrapiSharedPropertyHero[] {
  if (property === undefined || property === null) {
    return []
  }

  const heroImage = property.HeroImage === null
    ? null
    : 'data' in property.HeroImage
      ? property.HeroImage.data
      : property.HeroImage

  const heroImages: StrapiSharedPropertyHero[] = []

  for (const propertyHeroImage of property.HeroImages) {
    if (propertyHeroImage.Image === null) {
      continue
    }

    heroImages.push({
      id: propertyHeroImage.id,
      Name: propertyHeroImage.Name,
      Image: {
        data: 'data' in propertyHeroImage.Image
          ? propertyHeroImage.Image.data
          : {
              id: propertyHeroImage.Image.id,
              attributes: propertyHeroImage.Image
            }
      }
    })
  }

  if (heroImage === null || heroImages.length > 0) {
    return heroImages
  }

  let lastId = 0

  return heroImage.map((image) => {
    return {
      id: lastId++,
      Name: '',
      Image: {
        data: 'attributes' in image
          ? image
          : {
              id: image.id,
              attributes: image
            }
      }
    }
  })
}
