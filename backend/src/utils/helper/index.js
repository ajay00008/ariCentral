/**
 * Get approved users from a property object.
 * @param {Object} property - The property object.
 * @returns {Array} - The list of approved users.
 */

const getApprovedUsers = (property) => {
  return Array.isArray(property.ApprovedUsers) ? property.ApprovedUsers : []
}

const formatUSAddress = ({ Country, Region, City, StreetAddress1, StreetAddress2, PostalCode, Suburb, Address }) => {
  const street = [StreetAddress1, StreetAddress2].filter(Boolean).join(' ')
  const cityStateZip = [City, Region].filter(Boolean).join(', ') + (PostalCode ? ' ' + PostalCode : '')
  const address = [street, cityStateZip, Suburb, Country].filter(Boolean).join('\n')
  return address || Address
}

module.exports = {
  formatUSAddress,
  getApprovedUsers
}
