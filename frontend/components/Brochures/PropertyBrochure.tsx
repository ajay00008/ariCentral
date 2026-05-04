'use client'

import { Page, Text, View, Document, Image, StyleSheet, Font } from '@react-pdf/renderer'
import { convertPrice, formatPrice } from '@/constants/currencies'
import { buildGoogleStaticMapUrl } from '@/utils/buildGoogleMapUrl'
import { PDFImageComponent } from '@/components/Custom/PDFImageComponent'

interface Props {
  data: ActionGetPropertyBySlug
  currency: Currency
}

Font.register({
  family: 'Mundial',
  fonts: [
    { src: '/fonts/Mundial-Light.otf', fontWeight: 300 },
    { src: '/fonts/Mundial-Regular.otf', fontWeight: 400 },
    { src: '/fonts/Mundial-Bold.otf', fontWeight: 700 }
  ]
})

const styles = StyleSheet.create({
  section: {
    maxWidth: 595,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  container: {
    flexDirection: 'column',
    paddingTop: 35,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25
  },
  floorPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  column: {
    flexDirection: 'column',
    gap: 10
  },
  column3: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '50%'
  },
  column2: {
    marginTop: 'auto',
    flexDirection: 'row',
    gap: 10
  },
  textSmall: {
    fontSize: 8,
    fontFamily: 'Mundial',
    color: '#B0B0B0'
  },
  textLarge: {
    fontSize: 24,
    fontFamily: 'Mundial',
    fontWeight: 400
  },
  address: {
    fontFamily: 'Mundial',
    maxWidth: '85px',
    fontWeight: 400,
    fontSize: 10,
    whiteSpace: 'pre-line'
  },
  price: {
    fontFamily: 'Mundial',
    fontWeight: 400,
    fontSize: 8
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 45
  },
  imagesColumn: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  mainImageInColumn: {
    width: '50%',
    maxHeight: 300,
    objectFit: 'cover'
  },
  floorPlanImagesSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    marginTop: -33,
    marginBottom: 32
  },
  floorPlanImageSmall: {
    maxWidth: 170,
    objectFit: 'cover',
    maxHeight: 150
  },
  floorPlanImageBig: {
    maxWidth: 350,
    objectFit: 'cover',
    maxHeight: 150
  },
  image: {
    display: 'flex',
    width: '100%',
    height: 'auto',
    maxHeight: 300,
    objectFit: 'cover'
  },
  imageSmall: {
    display: 'flex',
    width: '100%',
    height: 'auto',
    maxHeight: 140,
    objectFit: 'fill'
  },
  summary: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 30
  },
  summaryListItem: {
    width: '100%',
    maxWidth: 110,
    borderTopWidth: 1,
    borderColor: '#C8C8C8'
  },
  summaryListItemHeader: {
    fontFamily: 'Mundial',
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 1,
    paddingBottom: 15,
    paddingTop: 16
  },
  summaryListItemHeaderNotVisible: {
    fontFamily: 'Mundial',
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 1,
    paddingBottom: 15,
    paddingTop: 16,
    opacity: 0
  },
  summaryListItemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },
  summaryCreditsListItemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  summaryListItemText: {
    fontFamily: 'Mundial',
    fontWeight: 300,
    fontSize: 8,
    lineHeight: 1
  },
  summaryCreditsListItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },
  summaryCreditsListItemHeader: {
    fontFamily: 'Mundial',
    fontWeight: 400,
    fontSize: 8,
    lineHeight: 1
  },
  summaryCreditsListItemText: {
    fontFamily: 'Mundial',
    fontWeight: 300,
    fontSize: 8,
    lineHeight: 1
  },
  floorPlan: {
    marginTop: '15',
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: 36
  },
  floorPlanText: {
    fontFamily: 'Mundial',
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 1
  },
  floorPlanImage: {
    marginLeft: 'auto',
    maxWidth: 265,
    maxHeight: 140,
    objectFit: 'contain'
  },
  footer: {
    width: '100%',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#D8D8D8',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontFamily: 'Mundial',
    fontWeight: 300,
    fontSize: 8,
    lineHeight: 1,
    color: '#464646'
  },
  footerImage: {
    maxWidth: 20,
    maxHeight: 12
  },
  googleMapSection: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingTop: 32,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#D8D8D8',
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
    justifyContent: 'space-between'
  },
  googleMapImage: {
    maxWidth: 396,
    maxHeight: 188,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
})

export function PropertyBrochure ({ data, currency }: Props): React.ReactNode {
  const lowerPricedUnit = data.floors.data.reduce((lowestUnit: CustomUnit | null, floor) => {
    if (floor.attributes === undefined || floor.id === undefined) return lowestUnit

    const floorUnits = floor.attributes.units.data
    const floorLowestUnit = floorUnits.reduce((lowest: CustomUnit | null, unit) => {
      if ((lowest === null) || unit.attributes.price < lowest.attributes.price) {
        return unit
      }
      return lowest
    }, null)

    if ((lowestUnit === null) || ((floorLowestUnit !== null) && floorLowestUnit.attributes.price < lowestUnit.attributes.price)) {
      return floorLowestUnit
    }
    return lowestUnit
  }, null)
  const facilitiesItems = data.Facilities

  if (facilitiesItems === undefined) return null

  const firstColumnItems: StrapiSharedItem[] = []
  const secondColumnItems: StrapiSharedItem[] = []

  if (facilitiesItems.Items.length >= 2) {
    const half = Math.ceil(facilitiesItems.Items.length / 2)
    firstColumnItems.push(...facilitiesItems.Items.slice(0, half))
    secondColumnItems.push(...facilitiesItems.Items.slice(half))
  } else {
    firstColumnItems.push(...facilitiesItems.Items)
  }

  return (
    <Document>
      <Page size='A4' style={styles.section}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.column}>
              <Text style={styles.textSmall}>
                {data.StageOfBuild.replace(/([A-Z])/g, (match, p1, offset) => {
                  return (offset > 0 ? '-' : '') + (p1 as string).toLowerCase()
                }).replace(/^./, str => str.toUpperCase()).trim()}
              </Text>
              <Text style={styles.textLarge}>{data.Name}</Text>
            </View>
            <View style={styles.column2}>
              {lowerPricedUnit !== null && (
                <Text style={styles.price}>
                  Priced from {formatPrice(currency, convertPrice(currency, lowerPricedUnit.attributes.price.toLocaleString('en-US')), true, true)}
                </Text>
              )}
            </View>
          </View>
          {/* <View style={styles.imagesRow}>
            <PDFImageComponent imageUrl={data.HeroImage.data?.attributes.url} styleClass={styles.image} />
          </View> */}
          <View style={styles.summary}>
            <View style={styles.summaryListItem}>
              <Text style={styles.summaryListItemHeader}>Facilities</Text>
              <View style={styles.summaryListItemList}>
                {firstColumnItems.map((item) => (
                  <Text key={item.id} style={styles.summaryListItemText}>{item.Item}</Text>
                ))}
              </View>
            </View>
            <View style={styles.summaryListItem}>
              <Text style={styles.summaryListItemHeaderNotVisible}>Facilities</Text>
              <View style={styles.summaryListItemList}>
                {secondColumnItems.map((item) => (
                  <Text key={item.id} style={styles.summaryListItemText}>{item.Item}</Text>
                ))}
              </View>
            </View>
            <View style={styles.summaryListItem}>
              <Text style={styles.summaryListItemHeader}>Dates</Text>
              <View style={styles.summaryListItemList}>
                {data.Dates?.Items.map((item) => (
                  <Text key={item.id} style={styles.summaryListItemText}>{item.Item}</Text>
                ))}
              </View>
            </View>
            {(data.Builder !== '' || data.Architect !== '' || data.Developer !== '') && (
              <View style={styles.summaryListItem}>
                <Text style={styles.summaryListItemHeader}>Credits</Text>
                <View style={styles.summaryCreditsListItemList}>
                  <View style={styles.summaryCreditsListItem}>
                    <Text style={styles.summaryCreditsListItemHeader}>Builder</Text>
                    <Text style={styles.summaryCreditsListItemText}>{data.Builder}</Text>
                  </View>
                  <View style={styles.summaryCreditsListItem}>
                    <Text style={styles.summaryCreditsListItemHeader}>Architect</Text>
                    <Text style={styles.summaryCreditsListItemText}>{data.Architect}</Text>
                  </View>
                  <View style={styles.summaryCreditsListItem}>
                    <Text style={styles.summaryCreditsListItemHeader}>Developer</Text>
                    <Text style={styles.summaryCreditsListItemText}>{data.Developer}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
          <View style={styles.floorPlan}>
            <Text style={styles.floorPlanText}>Floor Plan</Text>
            {lowerPricedUnit?.attributes.unitPlan.data?.attributes.url !== undefined && (
              <Image
                source={{
                  uri: lowerPricedUnit?.attributes.unitPlan.data?.attributes.url,
                  method: 'GET',
                  body: null,
                  headers: {}
                }}
                style={styles.floorPlanImage}
              />
            )}
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              For more information please contact  Jane Doe on +61 000 000 000 or Jane@doe.com
            </Text>
            <Image
              source={{
                uri: '/walker-logo-dark.png',
                method: 'GET',
                body: null,
                headers: {}
              }}
              style={styles.footerImage}
            />
          </View>
        </View>
      </Page>
      <Page size='A4' style={styles.section}>
        <View style={styles.container}>
          <View style={styles.floorPlanHeader}>
            <View style={styles.column}>
              <Text style={styles.floorPlanText}>Renders</Text>
            </View>
          </View>
          <View style={styles.imagesRow}>
            <PDFImageComponent
              imageUrl={data.PDFImages.data?.[0]?.attributes.url ?? ''}
              styleClass={styles.mainImageInColumn}
            />
            <View style={styles.imagesColumn}>
              <PDFImageComponent
                imageUrl={data.PDFImages.data?.[1]?.attributes.url ?? ''}
                isEmpty={data.PDFImages.data?.[1] === undefined}
                styleClass={styles.imageSmall}
              />
              <PDFImageComponent
                imageUrl={data.PDFImages.data?.[2]?.attributes.url ?? ''}
                isEmpty={data.PDFImages.data?.[2] === undefined}
                styleClass={styles.imageSmall}
              />
            </View>
          </View>
          <View style={styles.floorPlanImagesSection}>
            <PDFImageComponent
              imageUrl={data.PDFImages.data?.[3]?.attributes.url ?? ''}
              styleClass={styles.floorPlanImageSmall}
            />
            <PDFImageComponent
              imageUrl={data.PDFImages.data?.[4]?.attributes.url ?? ''}
              styleClass={styles.floorPlanImageBig}
            />
          </View>
          <View style={styles.googleMapSection}>
            <Text style={styles.address}>{data.Address}</Text>
            <Image
              source={{
                uri: buildGoogleStaticMapUrl(data.Address),
                method: 'GET',
                body: null,
                headers: {}
              }}
              style={styles.googleMapImage}
            />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              For more information please contact  Jane Doe on +61 000 000 000 or Jane@doe.com
            </Text>
            <Image
              source={{
                uri: '/walker-logo-dark.png',
                method: 'GET',
                body: null,
                headers: {}
              }}
              style={styles.footerImage}
            />
          </View>
        </View>
      </Page>
    </Document>
  )
}
