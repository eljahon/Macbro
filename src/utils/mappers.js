export const langMapper = lang => {
  const langs = {
    ru: 'Русский',
    uz: "O'zbekcha",
    en: 'English'
  }
  return langs[lang]
}
export const flagMapper = countryCode => {
  const countries = {
    uz: 'uz',
    ru: 'ru',
    en: 'gb'
  }
  return countries[countryCode]
}
