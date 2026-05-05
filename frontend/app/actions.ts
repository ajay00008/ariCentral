import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'
import { EventTypeKeys } from '@/constants/event-type'
import { transformPropertyResponse } from '@/lib/utils'
import { isPublicPropertiesEnabled } from '@/lib/public-properties'

export async function getStaticPageById (id: string, sessionToken?: string): Promise<ActionGetPropertyBySlug | null> {
  if (isPublicPropertiesEnabled() && sessionToken === undefined) {
    const publicResponse: Response = await fetchAPI(`/api/property/slug/${encodeURIComponent(id)}`, {
      method: 'GET',
      token: undefined
    }, false, true, true) as Response
    if (!publicResponse.ok) return null

    const publicData = await publicResponse.json() as unknown[]

    return publicData.length > 0 ? transformPropertyResponse(publicData[0]) : null
  }

  const data: Response = await fetchAPI(`/api/properties?filters[Slug][$eq]=${id}&pagination[pageSize]=100&populate=deep`, {
    method: 'GET',
    token: sessionToken
  }, false, true)

  const res = await data.json()
  return res.data?.[0]?.attributes ?? null
}
export async function getPropertyByShareToken (id: string): Promise<ActionGetPropertyBySlug | null> {
  const response: Response = await fetchAPI(`/api/property/share/${id}`, {
    method: 'GET'
  }, false, true)

  const data = await response.json()
  return data.length > 0
    ? transformPropertyResponse(data[0])
    : null
}

export async function getTermsAndConditions (): Promise<ActionGetDynamicPageBySlug | null> {
  const data: Response = await fetchAPI('/api/page/term', {
    method: 'GET',
    token: undefined
  }, true, true)
  const termsData = await data.json()

  return termsData ?? null
}

export async function getDynamicPageFromCollectionById (id: string): Promise<ActionGetDynamicPageBySlug | null> {
  const data: Response = await fetchAPI(`/api/pages?filters[Slug][$eq]=${id}&pagination[pageSize]=100&populate=deep`, {
    method: 'GET',
    token: undefined
  }, false, true)

  const res = await data.json()

  return res.data?.[0]?.attributes ?? null
}

export async function getPropertyCollection (): Promise<PropertiesData['data'] | null> {
  const data = await fetchAPI<PropertiesData['data']>('/api/admin/property/get', {
    method: 'GET',
    token: undefined
  }, true, false) as PropertiesData['data']

  return data ?? null
}

export async function getLastProperty (): Promise<LastProperty | null> {
  const data = await fetchAPI<LastProperty | null>(`${process.env.PUBLIC_URL}/api/property/last`, {
    method: 'GET',
    token: undefined
  }, true, false) as LastProperty | null

  return data ?? null
}

export async function searchPropertyByParams (filterParams: FilterParams, page: string, pageSize: string): Promise<ActionSearchPropertiesByParams | null> {
  const data = await fetchAPI<ActionSearchPropertiesByParams>('/api/user/search', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        filterParams,
        page,
        pageSize
      }
    }
  }, true, false) as ActionSearchPropertiesByParams

  return data ?? null
}

export async function searchUsersByParams (filterParams: FilterParamsUserSearch, page: string): Promise<ActionUserSearchParams | null> {
  const data = await fetchAPI<ActionUserSearchParams>('/api/admin/user/search', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        filterParams,
        page
      }
    }
  }, true, false) as ActionUserSearchParams

  return data ?? null
}

export async function getCurrentCurrency (): Promise<Currency | null> {
  const data = await fetchAPI<Currency>('/api/property/currency/get', {
    method: 'GET'
  }, true, false) as Currency

  return data ?? null
}

export async function getPasswordResetLink (email: string): Promise<void> {
  await fetchAPI('/api/user/reset-link', {
    method: 'POST',
    fields: {
      email
    }
  }, true, false)
}

export async function setResetedPassword (token: string, password: string): Promise<void> {
  await fetchAPI('/api/user/reset-password', {
    method: 'POST',
    fields: {
      data: {
        token,
        password
      }
    }
  }, true, false)
}

export async function checkTokenIsValid (token: string): Promise<{ message: string, code: number } | null> {
  const res = await fetchAPI<{ message: string, code: number }>('/api/user/check-token', {
    method: 'POST',
    fields: {
      data: {
        token
      }
    }
  }, true, false) as { message: string, code: number }

  return res ?? null
}

export async function getPropertyBySlug (slug: string): Promise<StrapiPropertyProperty | null> {
  const session = await getServerSession<{}, SessionType>(authOptions)
  const sessionToken = session?.user?.access_token ?? ''

  if (sessionToken === '') {
    return null
  }

  const response = await fetchAPI<Response>(
    `/api/properties?filters[Slug][$eq]=${slug.trim()}&populate=deep`,
    { token: sessionToken },
    false,
    true
  )

  const data = await response.json()

  if (data?.data.length !== 1) {
    return null
  }

  return data.data[0]
}

export async function updatePropertyById (data: StrapiPropertyProperty): Promise<void> {
  await fetchAPI('/api/admin/property', {
    method: 'PUT',
    fields: data
  }, true, false)
}

export async function uploadAssets (files: File | FileList): Promise<StrapiMedia[]> {
  const formData = new FormData()

  if (files instanceof FileList) {
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }
  } else {
    formData.append('files', files)
  }

  const data = await fetchAPI('/api/admin/file', {
    method: 'POST',
    token: undefined,
    fields: formData
  }, true, false)

  return data as StrapiMedia[]
}

export async function getDynamicPageById (slug: string): Promise<GetDynamicPageResult | null> {
  const session: SessionType | null = await getServerSession(authOptions)
  const sessionToken = session?.user?.access_token ?? ''
  if (sessionToken === '') return null

  const response: Response = await fetchAPI(
    `/api/pages?filters[Slug][$eq]=${slug}&populate=deep`,
    { token: sessionToken },
    false, true
  )

  const serverData = await response.json()
  const page = serverData.data[0]

  if (page === undefined || page === null) {
    return null
  }

  return { id: page.id, dynamicData: page.attributes }
}

export async function getAllUsers (page: string): Promise<ActionUserSearchParams> {
  const response = await fetchAPI<any>(`/api/admin/user/get-all?page=${page}`, {
    method: 'GET',
    token: undefined
  }, true, false)

  return response ?? null
}

export async function blockUserById (id: number): Promise<void> {
  await fetchAPI('/api/admin/user/block', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        userId: id
      }
    }
  }, true, false)
}

export async function unblockUserById (id: number): Promise<void> {
  await fetchAPI('/api/admin/user/unblock', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        userId: id
      }
    }
  }, true, false)
}

export async function confirmUserById (id: number, name: string, email: string): Promise<void> {
  await fetchAPI('/api/admin/user/confirm', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        userId: id,
        userName: name,
        userEmail: email
      }
    }
  }, true, false)
}

export async function unconfirmUserById (id: number, name: string, email: string): Promise<void> {
  await fetchAPI('/api/admin/user/unconfirm', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        userId: id,
        userName: name,
        userEmail: email
      }
    }
  }, true, false)
}

export async function deleteUserById (id: number): Promise<void> {
  await fetchAPI('/api/admin/user/delete', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        userId: id
      }
    }
  }, true, false)
}

export async function updateUserPassword (id: number, newPassword: string): Promise<void> {
  await fetchAPI('/api/admin/user/update/password', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        id,
        newPassword
      }
    }
  }, true, false)
}

export async function getCurrentUser (): Promise<ActionGetCurrentUser | null> {
  const data = await fetchAPI<ActionGetCurrentUser>('/api/admin/user/current', {
    method: 'GET',
    token: undefined
  }, true, false) as ActionGetCurrentUser

  return data ?? null
}

export async function updateCurrentUserEmail (id: number, email: string): Promise<void> {
  await fetchAPI('/api/admin/user/current/update/email', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        id,
        email
      }
    }
  }, true, false)
}

export async function updateCurrentUserPassword (
  oldPassword: string,
  newPassword: string,
  newPasswordConfirmed: string
): Promise<CreatedUser | APIError | null> {
  const res = await fetchAPI<CreatedUser | APIError>('/api/admin/user/current/update/password', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        oldPassword,
        newPassword,
        newPasswordConfirmed
      }
    }
  }, true, false) as CreatedUser | APIError

  return res ?? null
}

export async function registerNewUserInDB (
  email: string,
  password: string,
  firstName: string,
  surname: string,
  phone: string,
  address: string,
  companyName: string,
  country: string,
  howDidYouHear: string,
  bestDescribe: string,
  avgSalesPrice: string,
  introduced: string,
  marketsOfInterest: Array<{ Item: string }>
): Promise<CreatedUser | APIError | null> {
  const res = await fetchAPI<CreatedUser | APIError>('/api/user/register', {
    method: 'POST',
    token: undefined,
    fields: {
      email,
      password,
      surname,
      phone,
      address,
      companyName,
      firstName,
      country,
      howDidYouHear,
      bestDescribe,
      avgSalesPrice,
      introduced,
      marketsOfInterest
    }
  }, true, false, true) as CreatedUser | APIError

  return res ?? null
}

export async function stripeSetupIntent (subscriptionType: 'monthly' | 'annual'): Promise<{ clientSecret: string, subscriptionId: string }> {
  const res = await fetchAPI<Response>('/api/user/setup-intent', {
    method: 'POST',
    fields: {
      data: {
        subscriptionType
      }
    }
  }, true, true)

  const data = await res.json()
  return await z.object({ clientSecret: z.string(), subscriptionId: z.string() }).parseAsync(data)
}

export async function stripeConfirmSetupIntent (setupIntent: string | null, subscriptionId: string): Promise<{ success: boolean }> {
  const res = await fetchAPI<Response>('/api/user/confirm-setup-intent', {
    method: 'POST',
    fields: {
      setupIntent,
      subscriptionId
    }
  }, true, true)

  const data = await res.json()
  return await z.object({ success: z.boolean() }).parseAsync(data)
}

export async function getFAQCollection (): Promise<FAQCollectionElement[] | null> {
  const session: SessionType | null = await getServerSession(authOptions)
  const sessionToken = session?.user?.access_token ?? ''
  if (sessionToken === '') return null

  const response: Response = await fetchAPI(
    '/api/faqs?populate=deep&pagination[pageSize]=100&sort[0]=createdAt:asc',
    { token: sessionToken },
    false, true
  )

  const serverData = await response.json()
  return serverData.data
}

export async function createFAQCollectionElement (): Promise<FAQCollectionElement | null> {
  const response = await fetchAPI<FAQCollectionElement>('/api/admin/faq/create/collection-element', {
    method: 'GET',
    fields: undefined
  }, true, false) as FAQCollectionElement

  return response ?? null
}

export async function createCollectionSubElement (collectionId: number): Promise<FAQCollectionElement | null> {
  const response = await fetchAPI<FAQCollectionElement>('/api/admin/faq/sub/create-one', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        collectionId
      }
    }
  }, true, false) as FAQCollectionElement

  return response ?? null
}

export async function getFAQCollectionFrontEnd (): Promise<FAQCollectionElement[] | null> {
  const response = await fetchAPI<FAQCollectionElement[] | null>('/api/admin/faq/get-all', {
    method: 'GET',
    token: undefined,
    fields: undefined
  }, true, false) as FAQCollectionElement[] | null

  return response ?? null
}

export async function getFAQ (): Promise<FAQCollectionElement[] | null> {
  const response: Response = await fetchAPI('/api/faqs?populate=deep&pagination[pageSize]=100&sort[0]=createdAt:asc', {
    method: 'GET',
    token: undefined
  }, false, true)

  const faqCollection = await response.json()
  return faqCollection.data as FAQCollectionElement[]
}

export async function getAllProperties (page: number, pageSize: number): Promise<FullProperty[]> {
  const response = await fetchAPI<Response>(
    `/api/property/all-properties?page=${page}&pageSize=${pageSize}`,
    { method: 'GET' },
    true,
    true
  )

  if (!response.ok) return []
  const data = await response.json()
  return (data as FullProperty[]) ?? []
}

export async function getFeaturedProperties (): Promise<PropertyMain[] | null> {
  const response = await fetchAPI<PropertyMain[]>('/api/property/featured', {
    method: 'GET',
    fields: undefined
  }, true, false) as PropertyMain[]

  return response ?? null
}

export async function getEmailExistState (email: string): Promise<{ email: boolean, message: string } | null> {
  const response = await fetchAPI<{ email: boolean, message: string }>('/api/user/email-exist', {
    method: 'POST',
    fields: {
      email
    }
  }, true, false) as { email: boolean, message: string }

  return response ?? null
}

export async function updateFAQCollectionUpdated (collectionArray: FAQCollectionElement[], originalCollection: FAQCollectionElement[]): Promise<{ message: string } | null> {
  const response = await fetchAPI<{ message: string } | null>('/api/admin/faq/update/all', {
    method: 'POST',
    fields: {
      data: {
        collectionArray,
        originalCollection
      }
    }
  }, true, false) as { message: string } | null

  return response ?? null
}

export async function updatePropertyFeaturedStatus (propertyId: number, fieldValue: boolean): Promise<ActionPropertyFeatureStatus> {
  const response = await fetchAPI<ActionPropertyFeatureStatus>('/api/admin/property/update/featured', {
    method: 'POST',
    fields: {
      data: {
        id: propertyId,
        fieldValue
      }
    }
  }, true, false) as ActionPropertyFeatureStatus

  return response
}

export async function getAllDynamicPages (): Promise<ActionGetAllDynamicPages> {
  const response = await fetchAPI<ActionGetAllDynamicPages>('/api/admin/pages/get-all', {
    method: 'GET',
    token: undefined
  }, true, false) as ActionGetAllDynamicPages

  return response
}

export async function deleteDynamicPage (pageId: number): Promise<void> {
  await fetchAPI('/api/admin/pages/delete', {
    method: 'POST',
    fields: {
      data: {
        pageId: pageId.toString()
      }
    },
    token: undefined
  }, true, false)
}

export async function updateProfileImage (formData: FormData): Promise<ActionUpdateProfileImage> {
  const response = await fetchAPI<ActionUpdateProfileImage>('/api/user/update/image', {
    method: 'POST',
    fields: formData
  }, true, false) as ActionUpdateProfileImage

  return response
}

export async function deleteImageFromDatabase (imageId: number): Promise<void> {
  await fetchAPI('/api/user/update/image/delete', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        imageId
      }
    }
  }, true, false)
}

export async function updateUserInDB (
  email: string,
  firstName: string,
  surname: string,
  phone: string,
  companyName: string
): Promise<CreatedUser | APIError | null> {
  const res = await fetchAPI<CreatedUser | APIError>('/api/user/update/data', {
    method: 'POST',
    token: undefined,
    fields: {
      email,
      firstName,
      surname,
      phone,
      companyName
    }
  }, true, false) as CreatedUser | APIError

  return res ?? null
}

export async function updateUserCommissionInDB (isShow: boolean): Promise<CreatedUser | APIError | null> {
  const res = await fetchAPI<CreatedUser | APIError>('/api/user/update/commission', {
    method: 'POST',
    token: undefined,
    fields: {
      isShow
    }
  }, true, false) as CreatedUser | APIError

  return res ?? null
}

export async function deletePropertyById (id: number): Promise<void> {
  await fetchAPI('/api/admin/property/delete', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        propertyId: id
      }
    }
  }, true, false)
}

export async function registerForUpdates (slug: string, name: string): Promise<{ success: boolean }> {
  const res = await fetchAPI<Response>('/api/user/register-for-update', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        slug,
        name
      }
    }
  }, true, true)

  const data = await res.json()
  return await z.object({ success: z.boolean() }).parseAsync(data)
}

export async function updateUserRegisteredUpdates (
  slug: string
): Promise<{ success: boolean, registeredUpdates: Array<{ Item: string }> } | null> {
  const session: SessionType | null = await getServerSession(authOptions)
  const sessionToken = session?.user?.access_token ?? ''
  if (sessionToken === '') return null
  const currentUpdates: Array<{ Item: string }> = (session?.user?.registeredForUpdates ?? []).map(update =>
    typeof update === 'string' ? { Item: update } : update
  )

  await fetchAPI(
    `/api/users/${String(session?.user?.id)}`,
    {
      method: 'PUT',
      token: sessionToken,
      fields: {
        registeredForUpdates: [...currentUpdates, { Item: slug }]
      }
    },
    false,
    true
  )

  return {
    success: true,
    registeredUpdates: [...currentUpdates, { Item: slug }]
  }
}

export function trackEvent (slug: string, eventType: EventTypeKeys): void {
  void fetchAPI('/api/property/event-track', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        slug,
        eventType
      }
    }
  }, true, true)
}

export async function generateShareToken (slug: string): Promise<{ success: boolean, shareToken: string }> {
  const res = await fetchAPI<Response>('/api/admin/property/generate-share-token', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        slug
      }
    }
  }, true, true)

  const data = await res.json()
  return await z.object({ success: z.boolean(), shareToken: z.string() }).parseAsync(data)
}

export async function sendTrackEvent (slug: string, eventType: EventTypeKeys): Promise<void> {
  const session: SessionType | null = await getServerSession(authOptions)
  const sessionToken = session?.user?.access_token ?? ''
  if (sessionToken === '') throw new Error('You are not authenticated')

  void fetchAPI(`/api/property/${slug}/track/${eventType}`,
    {
      method: 'POST',
      token: sessionToken
    },
    false,
    true
  )
}

export async function requestAccess (slug: string): Promise<{ success: boolean, message: string }> {
  const res = await fetchAPI<Response>('/api/property/request-access', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        slug
      }
    }
  }, true, true)

  const data = await res.json()
  return await z.object({ success: z.boolean(), message: z.string() }).parseAsync(data)
}

export async function getAccessRequests (page: string, pageSize: string): Promise<{ data: AccessRequest[], meta: Meta }> {
  const response = await fetchAPI<Response>(`/api/admin/access-requests?page=${page}&pageSize=${pageSize}`, {
    method: 'GET',
    token: undefined
  }, true, true)

  const res = await response.json()

  return res
}

export async function handleAccessRequestAction (id: number, action: 'approve' | 'reject' | 'revoke'): Promise<{ success: boolean, message: string }> {
  const response = await fetchAPI<Response>('/api/admin/access-requests', {
    method: 'POST',
    token: undefined,
    fields: {
      data: {
        id,
        action
      }
    }
  }, true, true)

  if (!response.ok) {
    throw new Error(`Failed to ${action} request.`)
  }

  const data = await response.json()
  return await z.object({ success: z.boolean(), message: z.string() }).parseAsync(data)
}

export async function sendAccessRequestAction (id: number, action: 'approve' | 'reject'): Promise<void> {
  const response = await fetchAPI<Response>(`/api/access-requests/${id}/${action}`, {
    method: 'POST',
    token: undefined
  }, true, false)

  if (!response.ok) {
    throw new Error(`Failed to ${action} request.`)
  }
}
