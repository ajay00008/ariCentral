export function Capitalize (str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function deCapitalize (str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function TitleCapitalize (str: string | undefined): string {
  if (str === undefined) return ''
  if (typeof str === 'string' && str.length > 0) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  } else {
    return str
  }
}
