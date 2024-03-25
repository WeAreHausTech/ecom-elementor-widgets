import { useTranslation as useTranslationBase } from 'react-i18next'
import { i18n as i18nBase } from '@haus-tech/ecom-components/providers'

export const useTranslation = (ns?: string) => {
  return useTranslationBase(ns, { i18n: i18nBase })
}
