interface FetchAPIOptions extends RequestInit {
  token?: string
  fields?: Record<string, any> | FormData | string
}

export async function fetchAPI<T = APIEmpty> (
  resource: string,
  options: FetchAPIOptions = {},
  isBackend = false,
  returnResponse = true,
  rawResponse = false
): Promise<T | Response> {
  const endpoint = isBackend ? resource : process.env.STRAPI_ENDPOINT + resource

  options.method ??= 'GET'

  options.headers = {
    Accept: 'application/json',
    authorization: options.token !== undefined ? `Bearer ${options.token}` : '',
    ...(options.headers ?? {})
  }

  options.cache = 'no-store'

  if (options.fields instanceof FormData) {
    delete (options.headers as Record<string, string>)['content-type']
    options.body = options.fields
  } else if (options.fields !== undefined && typeof options.fields === 'object' && Object.keys(options.fields).length > 0) {
    options.body = JSON.stringify(options.fields);
    (options.headers as Record<string, string>)['content-type'] = 'application/json'
  } else if (options.fields !== undefined && typeof options.fields === 'string') {
    options.body = options.fields;
    (options.headers as Record<string, string>)['content-type'] = 'application/json'
  }

  const response = await fetch(endpoint, options)

  if (!rawResponse && !response.ok) {
    const text = await response.text()
    throw new Error(`Failed to fetch API: ${response.statusText}. Answer: ${text}`)
  }

  return returnResponse ? response : await response.json()
}
