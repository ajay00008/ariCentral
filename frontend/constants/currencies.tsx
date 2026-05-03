export const initialCurrency: Currency = {
  AUD: 1,
  USD: 1,
  EUR: 1,
  SGD: 1,
  GBP: 1,
  CAD: 1,
  NZD: 1,
  BTC: 1,
  BaseCurrency: 'AUD'
}

type CurrencyKey = keyof typeof currenciesTemplate

export const currenciesTemplate = {
  AUD: 'AUD ($)',
  USD: 'USD ($)',
  EUR: 'EUR (€)',
  SGD: 'SGD ($)',
  GBP: 'GBP (£)',
  CAD: 'CAD ($)',
  NZD: 'NZD ($)',
  BTC: 'BTC (₿)'
}

export const currenciesTemplate2 = {
  AUD: '$',
  USD: '$',
  EUR: '€',
  SGD: '$',
  GBP: '£',
  CAD: '$',
  NZD: '$',
  BTC: '₿'
}

export const currenciesTemplate3 = {
  AUD: '$',
  USD: '$',
  EUR: '€',
  SGD: '$',
  GBP: '£',
  CAD: '$',
  NZD: '$',
  BTC: 'B'
}

export const currenciesTemplate4 = {
  AUD: 'AUD $',
  USD: 'USD $',
  EUR: 'EUR €',
  SGD: 'SGD $',
  GBP: 'GBP £',
  CAD: 'CAD $',
  NZD: 'NZD $',
  BTC: 'BTC ₿'
}

export function formatPrice (object: Currency, value: number | string, onlySymbol?: boolean, isBrochurePDF?: boolean, isSearch?: boolean): string {
  const base = object.BaseCurrency as CurrencyKey
  if (isSearch !== undefined && isSearch) {
    const currencySymbol = currenciesTemplate4[base] ?? ''
    return `${currencySymbol}${value}`
  } else if (isBrochurePDF !== undefined && isBrochurePDF) {
    const currencySymbol = currenciesTemplate3[base] ?? ''
    return `${currencySymbol} ${value}`
  } else if (onlySymbol !== undefined && onlySymbol) {
    const currencySymbol = currenciesTemplate2[base] ?? ''
    return `${currencySymbol} ${value}`
  } else {
    const currencySymbol = currenciesTemplate[base] ?? ''
    return `${currencySymbol} ${value}`
  }
}

export function convertPrice (object: Currency, price: number | string): string {
  const priceType = typeof price === 'number' ? price : isNaN(parseInt(price)) ? 0 : Number.parseInt(price.replace(/[^0-9.-]+/g, ''), 10)
  const currencyPrice = (object[object.BaseCurrency as CurrencyKey] * priceType)
  let result: number
  if (currencyPrice < 1 && currencyPrice > 0) {
    result = currencyPrice
  } else {
    result = Math.round(currencyPrice)
  }
  return result.toLocaleString('en-US')
}

export function convertPriceWithSuffix (object: Currency, price: number | string): string {
  const priceType = typeof price === 'number' ? price : isNaN(parseInt(price)) ? 0 : Number.parseInt(price.replace(/[^0-9.-]+/g, ''), 10)
  const currencyPrice = (object[object.BaseCurrency as CurrencyKey] * priceType)
  return convertPriceWithoutCurrency(currencyPrice)
}

export function convertPriceWithoutCurrency (val: number): string {
  const suffix = val >= 1_000_000 ? 'M' : val >= 1_000 ? 'K' : ''
  const divisor = val >= 1_000_000 ? 1_000_000 : val >= 1_000 ? 1_000 : 1
  const result = Math.ceil(val * 10 / divisor) / 10

  return `${result}${suffix}`
}
