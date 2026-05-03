export interface FieldErrors {
  [key: string]: string
}

interface UserFormData {
  email?: string
  password?: string
  firstName?: string
  surname?: string
  phone?: string
  address?: string
  companyName?: string
  country?: string
  howDidYouHear?: string
  bestDescribe?: string
  avgSalesPrice?: string
  introduced?: string
}

export function validateUserForm (
  formData: UserFormData,
  editMode: boolean = false
): FieldErrors {
  const errors: FieldErrors = {}

  if (formData.email === undefined || formData.email.trim() === '') {
    errors.email = 'Email is required'
  }
  if (!editMode && (formData.password === undefined || formData.password.trim() === '')) {
    errors.password = 'Password is required'
  }
  if (formData.firstName === undefined || formData.firstName.trim() === '') {
    errors.firstName = 'First name is required'
  }
  if (formData.surname === undefined || formData.surname.trim() === '') {
    errors.surname = 'Last name is required'
  }
  if (formData.phone === undefined || formData.phone.trim() === '') {
    errors.phone = 'Phone is required'
  }
  if (formData.address === undefined || formData.address.trim() === '') {
    errors.address = 'Address is required'
  }
  if (formData.companyName === undefined || formData.companyName.trim() === '') {
    errors.companyName = 'Company name is required'
  }
  if (formData.country === undefined || formData.country.trim() === '') {
    errors.country = 'Please select a country'
  }
  if (formData.howDidYouHear === undefined || formData.howDidYouHear.trim() === '') {
    errors.howDidYouHear = 'Please select how you heard about us'
  }
  if (formData.bestDescribe === undefined || formData.bestDescribe.trim() === '') {
    errors.bestDescribe = 'Please select an option'
  }
  if (formData.avgSalesPrice === undefined || formData.avgSalesPrice.trim() === '') {
    errors.avgSalesPrice = 'Please select an average sales price'
  }
  if (formData.introduced === undefined || formData.introduced.trim() === '') {
    errors.introduced = 'Please select who introduced you'
  }

  return errors
}
