declare interface FilterParamsUserSearch {
  mainQ?: string
  email?: string
  firstName?: string
  surname?: string
  blocked?: boolean
  confirmed?: boolean
  roleId?: number
  [key: string]: string | number | boolean | undefined
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare interface Property {
  attributes: {
    floor: {
      data: Floor[]
    }
  }
  id: number
}

declare interface Floor {
  attributes: {
    property?: Property
    identifier?: string | number
    units: { data: CustomUnit[] }
  }
  id: number
}

declare interface Unit {
  attributes?: {
    status?: string
    type?: string
    aspect?: string
    beds?: string
    baths?: string
    cars?: number
    powder?: number
    price?: number
    commission?: number
    bodyCorp?: number
    rentApp?: number
    rates?: number
    living?: number
    internalSize?: number
    externalSize?: number
    identifier?: string
    order?: number
    unitPlan?: {
      data: StrapiMedia
    }
  }
  id?: number
}

declare interface CustomUnit {
  attributes: {
    status: string
    type: string
    aspect: string
    beds: string
    baths: string
    cars: number
    powder: number
    price: number
    commission: number
    bodyCorp: number
    rentApp: number
    rates: number
    living: number
    internalSize: number
    externalSize: number
    identifier: string
    order: number
    unitPlan: {
      data: StrapiMedia | null
    }
    unitGallery: {
      data?: StrapiMedia[]
    }
    floor: {
      data: {
        id: number
        attributes: {
          identifier: string
        }
      }
    }
    positions: StrapiSharedUnitPosition[]
  }
  id: number
}

declare interface UnitWithIndex extends CustomUnit {
  floorIndex: number
}

declare interface Gallery {
  attributes: {
    SubGallery: {
      data: SubGallery[]
    }
  }
  id: number
}

declare interface SubGalleryAttributes {
  Media: {
    data: StrapiMedia[] | null
  }
  Name: string
  id: number
}

declare interface SubGallery {
  attributes: SubGalleryAttributes
  id: number
}

declare interface PropertiesData {
  data: {
    allProperties: {
      data: Array<{
        attributes: {
          Name: string
          Slug: string
          Featured: boolean
          createdAt: string
          publishedAt: string
          updatedAt: string
        }
        id: number
      }>
    }
  }
}

declare interface GetDynamicPageResult {
  id: number
  dynamicData: DynamicPage['attributes']
}

declare interface PropertyList {
  Identifier: string
  Items: StrapiSharedItem[]
  id: number
}

declare interface PropertyData {
  Name: string
  Slug: string
  RequestStatus: 'not_requested' | 'pending' | 'approved' | 'rejected'
  Approved: boolean
  createdAt: string
  Address: string
  Developer: string
  Builder: string
  Architect: string
  BookACallLink: string
  MakeAnOfferLink: string
  ProjectWebsiteLink: string
  Brochure: {
    data: StrapiMedia | null
  }
  HeroImage: {
    data: StrapiMedia[] | null
  }
  HeroImages: StrapiSharedPropertyHero[]
  PDFImages: {
    data: StrapiMedia[] | null
  }
  Facilities: PropertyList
  Details: PropertyList
  Dates: PropertyList
  LowerPricedUnit: StrapiUnitUnit | null
  DealType: string
  PropertyType: string
  StageOfBuild: string
  ListsValues: string
  Summary: string
  Commission: number
  Downloads: DownloadsItem[]
  RegisterForUpdatesCode: string
  floors: {
    data: Floor[]
  }
  ViewsGallery: {
    Name: string
    id: number
    SubGallery: ServerSubGalleryData[]
  }
  AmenitiesGallery: {
    Name: string
    id: number
    SubGallery: ServerSubGalleryData[]
  }
  Gallery: {
    Name: string
    id: number
    SubGallery: ServerSubGalleryData[]
  }
  InteriorGallery: {
    Name: string
    id: number
    SubGallery: ServerSubGalleryData[]
  }
}

declare interface APIError {
  err?: string
  code?: number
  message?: string
}

declare type APIEmpty = APIError & {
}

declare type APIAdminLoginResult = APIError & {
  newUser?: Authentication
}

declare interface Authentication {
  jwt: string
  user: User
  error: {
    message: string
    status: number
  }
}

declare interface User {
  id: number
  username: string
  email: string
  confirmed: boolean
  blocked: boolean
  role: string
  firstName: string
  surname: string
}

declare interface PropertyMain {
  id?: number
  attributes?: PropertyData
}

declare type ActionCreateSingleFloor = APIError & {
  serverData?: Floor
}

declare type ActionDeleteSingleFloor = APIError & {
  serverData?: {
    status: number
  }
}

declare interface ServerSubGalleryData {
  Name: string
  id: number
  Media: {
    data: StrapiMedia[] | null
  }
}

declare interface CustomUser {
  id: number
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  country: string
  howDidYouHear: string
  bestDescribe: string
  avgSalesPrice: string
  stripeCustomerId: string
  stripeSetupIntentSuccessful: boolean
  introduced: string
  companyName: string
  phone: string
  surname: string
  firstName: string
  approved: boolean
  address: string
  role: {
    name: string
    id: number
    type: string
  }
}

declare type ActionGetAllUsers = APIError & CustomUser & {}

declare type ActionUpdateUser = APIError & CustomUser & {}

declare interface CreatedUser {
  jwt: string
  user: {
    blocked: boolean
    username: string
    email: string
    id: number
    provider: string
    createdAt: string
    publishedAt: string
    confirmed: boolean
    updatedAt: string
    country: string
    howDidYouHear: string
    bestDescribe: string
    avgSalesPrice: string
    stripeCustomerId: string
    stripeSetupIntentSuccessful: boolean
    introduced: string
    companyName: string
    address: string
    phone: string
    surname: string
    firstName: string
    approved: boolean
    role: {
      id: number
      name: string
      type: string
    }
  }
}

declare type ActionCreateUser = APIError & CreatedUser & {}

declare interface CurrentUser {
  id: number
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
}

declare type ActionGetCurrentUser = APIError & CurrentUser & {}

declare interface UpdatedUser extends CurrentUser {
  role: {
    id: number
    name: string
    description: string
    type: string
    createdAt: string
    updatedAt: string
  }
}

declare type ActionUpdateCurrentUserEmail = APIError & UpdatedUser & {}

declare interface PasswordForm {
  oldPassword: string
  newPassword: string
  newPasswordConfirmed: string
}

declare interface PasswordFormModal {
  newPassword: string
}

declare interface ActionGetPropertyBySlug {
  Name: string
  Slug: string
  floors: {
    data: Floor[]
  }
  RequestStatus?: 'not_requested' | 'pending' | 'approved' | 'rejected'
  Approved: boolean
  ViewsGallery: {
    Name?: string
    id: number
    SubGallery?: ServerSubGalleryData[]
  }
  AmenitiesGallery: {
    Name?: string
    id: number
    SubGallery?: ServerSubGalleryData[]
  }
  Gallery: {
    Name?: string
    id: number
    SubGallery?: ServerSubGalleryData[]
  }
  InteriorGallery: {
    Name?: string
    id: number
    SubGallery?: ServerSubGalleryData[]
  }
  HeroImage: {
    data: StrapiMedia[] | null
  }
  LowerPricedUnit?: StrapiUnitUnit | null
  HeroImages: StrapiSharedPropertyHero[]
  Brochure: {
    data: StrapiMedia | null
  }
  PDFImages: {
    data: StrapiMedia[] | null
  }
  Address: string
  Architect: string
  Builder: string
  Developer: string
  Facilities?: PropertyList
  Details?: PropertyList
  Dates?: PropertyList
  BookACallLink: string
  MakeAnOfferLink: string
  ProjectWebsiteLink: string
  RegisterForUpdatesCode: string
  DealType: string
  Summary: string
  Commission: number
  StageOfBuild: string
  PageView: number
  MakeOfferButtonClicks: number
  DownloadButtonClicks: number
  Downloads: DownloadsItem[]
  createdAt: string
  shareToken: string | null
}

declare interface ActionGetDynamicPageBySlug {
  Name: string
  Slug: string
  Date: string
  Content: string
  Description: string
}

declare interface Currency {
  AUD: number
  USD: number
  EUR: number
  SGD: number
  GBP: number
  CAD: number
  NZD: number
  BTC: number
  BaseCurrency: string
}

declare interface StrapiSharedItem {
  id: number
  Item: string
}

declare interface SessionType {
  user?: {
    id?: number | string | null
    name?: string | null
    email?: string | null
    image?: string | null
    access_token?: string | null
    role?: string | null
    country?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    firstName?: string | null
    surname?: string | null
    showCommission?: boolean | null
    stripeCustomerId?: string | null
    subscriptionStatus?: boolean | null
    subscriptionId?: string | null
    registeredForUpdates?: StrapiSharedItem[] | null
    stripeSetupIntentSuccessful?: boolean | null
    avatar?: {
      id?: number | string | null
      url?: string | null
      width?: number | null
      height?: number | null
    }
    phone?: string | null
    email?: string | null
    companyName?: string | null
  }
}

declare interface ImageGallery {
  marketPlace: ActionGetPropertyBySlug['AmenitiesGallery'] |
  ActionGetPropertyBySlug['Gallery'] |
  ActionGetPropertyBySlug['InteriorGallery']
}

declare interface FilterParamsSelects {
  Min: string
  Max: string
  Bedroom: string
  Bathroom: string
  Living: string
  CarSpaces: string
}

declare type FilterParams = FilterParamsSelects & SearchCheckboxes & {
  mainQ: string[]
  viewType: string
}

declare interface FilterParamsSearchAction {
  mainQ: string[]
  viewType?: string
  Pool: boolean
  Spa: boolean
  Sauna: boolean
  RooftopTerrace: boolean
  Lift: boolean
  WaterViews: boolean
  PreRelease: boolean
  UnderConstruction: boolean
  Completed: boolean
  Min: string
  Max: string
  Bedroom: string
  Bathroom: string
  Living: string
  CarSpaces: string
  Penthouse: boolean
  Apartment: boolean
  House: boolean
  Villa: boolean
  Townhouse: boolean
  Land: boolean
}

interface SearchCheckboxes {
  Pool: boolean
  Spa: boolean
  Sauna: boolean
  RooftopTerrace: boolean
  Lift: boolean
  WaterViews: boolean
  Penthouse: boolean
  Apartment: boolean
  House: boolean
  Villa: boolean
  Townhouse: boolean
  Land: boolean
  PreRelease: boolean
  UnderConstruction: boolean
  Completed: boolean
}

declare interface ActionSearchPropertiesByParams {
  data: FullProperty[]
}

declare interface FullProperty {
  id: number
  attributes: ActionGetPropertyBySlug
}

declare interface StrapiRolesArray {
  roles: StrapiRole[]
}

declare interface StrapiRole {
  id: number
  name: string
  description: string
  type: string
  createdAt: string
  updatedAt: string
  nb_users: number
}

declare interface LastProperty {
  id: number
  Name: string
  Address: string
  HeroImage: Array<Omit<StrapiMedia, 'attributes'> & StrapiMedia['attributes']> | null
  HeroImages: Array<
  Omit<StrapiSharedPropertyHero, 'Image'> & {
    Image: (Omit<StrapiMedia, 'attributes'> & StrapiMedia['attributes'])
  }
  >
}

declare interface FAQCollectionElement {
  id: number
  attributes: {
    collectionName: string
    collectionItems: FAQSubCollectionElement
  }
}

declare interface FAQSubCollectionElement {
  id: number
  collectionElement: FAQSubSemiCollectionElement[]
}

declare interface FAQSubSemiCollectionElement {
  id: number
  collectionElementHeading: string
  collectionItemMarkdown: string
}

declare interface DownloadsItem {
  id: number
  Icon: string
  downloadFile: {
    data: StrapiMedia | null
  }
  downloadName: string
}

declare interface ActionPropertyFeatureStatus {
  message?: string
}

declare interface DynamicPage {
  id: number
  attributes: {
    Name: string
    Slug: string
    Description: string
    Content: string
    Date: Date
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

declare type ActionGetAllDynamicPages = APIError & {
  data: DynamicPage[]
}

declare type ActionProcessDynamicPage = APIError & DynamicPage

declare interface ActionUpdateProfileImage {
  id: number | string
  name: string
  width: number
  height: number
  url: string
  createdAt: string
  updatedAt: string
  ext: string
  mime: string
}

declare interface SessionUserData {
  firstName: string | null | undefined
  surname: string | null | undefined
  companyName: string | null | undefined
}

declare type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never
}[keyof T]

declare type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

declare type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

declare type KeysNonMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? never : K
}[keyof T]

declare interface StrapiUnitUnit {
  id: number
  attributes: {
    externalSize: number | null
    internalSize: number | null
    cars: number | null
    powder: number | null
    unitPlan: {
      data: StrapiMedia | null
    }
    order: number | null
    identifier: string
    status: 'AVAILABLE' | 'SOLD' | 'RESERVED'
    aspect: 'SOUTH' | 'NORTH' | 'WEST' | 'EAST'
    type: 'TOWNHOUSE' | 'APARTMENT' | 'HOUSE' | 'PENTHOUSE' | 'LAND' | 'VILLA'
    unitGallery: {
      data: StrapiMedia[] | null
    }
    price: number | null
    beds: string | null
    baths: string | null
    bodyCorp: number | null
    rentApp: number | null
    rates: number | null
    living: number | null
    positions: StrapiSharedUnitPosition[]
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

declare type StrapiUnitUnitMediaFields = KeysMatching<
StrapiUnitUnit['attributes'],
{ data: StrapiMedia | null } | { data: StrapiMedia[] | null }
>

declare interface StrapiFloorFloor {
  id: number
  attributes: {
    identifier: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    units: {
      data: StrapiUnitUnit[]
    }
  }
}

declare type StrapiFloorFloorInputFields = KeysNonMatching<
StrapiFloorFloor['attributes'],
{ data: any }
>

declare interface StrapiPropertyProperty {
  id: number
  attributes: {
    Name: string
    Slug: string
    Address: string | null
    Builder: string | null
    Architect: string | null
    Developer: string | null
    BookACallLink: string | null
    MakeAnOfferLink: string | null
    ProjectWebsiteLink: string | null
    DealType: 'ExclusiveOffMarket' | 'OnMarket'
    ListsValues: string
    StageOfBuild: 'PreRelease' | 'UnderConstruction' | 'Completed'
    Summary: string | null
    Commission: number
    PropertyType: 'Land' | 'Residential' | 'Commercial'
    Featured: boolean
    RegisterForUpdatesCode: string | null
    createdAt: string
    updatedAt: string
    publishedAt: string
    floors: {
      data: StrapiFloorFloor[]
    }
    ViewsGallery: StrapiSharedGallery | null
    InteriorGallery: StrapiSharedGallery | null
    HeroImage: {
      data: StrapiMedia[] | null
    }
    StreetAddress1: string | null
    StreetAddress2: string | null
    City: string | null
    Region: string | null
    PostalCode: string | null
    Country: string | null
    Suburb: string | null
    HeroImages: StrapiSharedPropertyHero[]
    AmenitiesGallery: StrapiSharedGallery | null
    Gallery: StrapiSharedGallery | null
    Facilities: StrapiSharedList | null
    Details: StrapiSharedList | null
    Dates: StrapiSharedList | null
    PDFImages: {
      data: StrapiMedia[] | null
    }
    Downloads: StrapiSharedDownload[]
    Brochure: {
      data: StrapiMedia | null
    }
  }
}

declare type StrapiPropertyPropertyFields = keyof StrapiPropertyProperty['attributes']

declare type StrapiPropertyPropertyMediaFields = KeysMatching<
StrapiPropertyProperty['attributes'],
{ data: StrapiMedia | null } | { data: StrapiMedia[] | null }
>

declare type StrapiPropertyPropertyInputFields = KeysNonMatching<
StrapiPropertyProperty['attributes'],
{ data: any }
>

declare type StrapiPropertyPropertyTextFields = KeysMatching<
StrapiPropertyProperty['attributes'],
string | (string | null)
>

declare interface StrapiMedia {
  id: number
  attributes: {
    name: string
    alternativeText: string | null
    caption: string | null
    width: number | null
    height: number | null
    formats: {
      thumbnail: {
        url: string
      }
    } | null
    hash: string
    ext: string | null
    mime: string
    size: number
    url: string
    previewUrl: string | null
    provider: string
    provider_metadata: object | null
    createdAt: string
    updatedAt: string
  }
}

declare interface StrapiSharedDownload {
  id: number
  downloadName: string | null
  downloadFile: {
    data: StrapiMedia | null
  }
  Icon: 'Image' | 'Chart' | 'FloorPlan' | 'Building'
}

declare interface StrapiSharedList {
  id: number
  Identifier: string | null
  Items: Array<{
    id: number
    Item: string | null
  }> | null
}

declare interface StrapiSharedGallery {
  id: number
  name: string
  SubGallery: StrapiSharedSubGallery[]
}

declare interface StrapiSharedSubGallery {
  id: number
  Name: string
  Media: {
    data: StrapiMedia[] | null
  }
}

declare type StrapiSharedSubGalleryMediaFields = KeysMatching<
StrapiSharedSubGallery,
{ data: StrapiMedia | null } | { data: StrapiMedia[] | null }
>

declare interface StrapiSharedUnitPosition {
  id: number
  imageId: number
  x: number
  y: number
}

declare interface StrapiSharedPropertyHero {
  id: number
  Name: string
  Image: {
    data: StrapiMedia
  }
}

declare interface AccessRequest {
  id: number
  attributes: {
    Status: 'pending' | 'approved' | 'rejected'
    createdAt: string
    updatedAt: string
    Property: {
      data: PropertyMain
    }
    User: {
      data: {
        id: number
        attributes: CustomUser
      }
    }
  }
}

declare interface ParsedAddress {
  address1: string
  city: string
  region: string
  postalCode: string
  country: string
}

declare interface Pagination {
  page: 1
  pageSize: 10
  pageCount: 1
  total: 0
}

declare interface Meta {
  pagination: Pagination
}

declare interface ActionUserSearchParams {
  data: ActionGetAllUsers[]
  meta: Meta
}
