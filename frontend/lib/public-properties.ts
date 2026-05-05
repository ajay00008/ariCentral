export function isPublicPropertiesEnabled (): boolean {
  return process.env.ALLOW_PUBLIC_PROPERTIES === 'true' ||
    process.env.NEXT_PUBLIC_ALLOW_PUBLIC_PROPERTIES === 'true'
}

export function isPublicPropertiesEnabledClient (): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_PUBLIC_PROPERTIES === 'true'
}
