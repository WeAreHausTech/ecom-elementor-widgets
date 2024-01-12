/* eslint-disable no-case-declarations */
import React, { ReactNode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { DataProvider, LocalizationProvider } from '@haus-tech/ecom-components'

import { camelCase } from 'lodash'
import styles from '@haus-tech/ecom-components/dist/ecom-style.css?url'
import ecomWidgets from './widgets'

async function fetchCSSContent() {
  const response = await fetch(styles)
  return await response.text()
}

const allWidgets = {
  ...ecomWidgets,
}

export const renderElement = async (element: Element, children: ReactNode) => {
  const css = await fetchCSSContent()
  const shadowRoot = element.attachShadow({ mode: 'open' })

  const styleEl = document.createElement('style')
  styleEl.textContent = css
  shadowRoot.appendChild(styleEl)

  const resourceBundles = getLangData()
  const queryUpdates = getQueryUpdates()
  const config = getConfig()

  return ReactDOM.createRoot(shadowRoot).render(
    <React.StrictMode>
      <DataProvider
        provider="vendure"
        updates={queryUpdates}
        options={{
          ...config.options,
        }}
      >
        <LocalizationProvider resourceBundles={resourceBundles}>{children}</LocalizationProvider>
      </DataProvider>
    </React.StrictMode>,
  )
}

const init = async () => {
  const elements: Element[] = Array.from(document.getElementsByClassName('ecom-components-root'))
  elements.forEach((element: Element) => {
    const dataAttributes = element.attributes
    const widgetType = dataAttributes.getNamedItem('data-widget-type')?.value

    if (widgetType) {
      const widget = allWidgets[camelCase(widgetType) as keyof typeof allWidgets]
      if (widget) {
        const widgetElement = widget(dataAttributes)
        renderElement(element, <Suspense>{widgetElement}</Suspense>)
      }
    }
  })
}

if (document.readyState !== 'loading') {
  init()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    init()
  })
}

const getLangData = () => {
  const langData = localStorage.getItem('ecomLangData')

  if (langData) {
    const jsonLangData = JSON.parse(langData)

    const resourceBundles = []

    for (const lang in jsonLangData) {
      // eslint-disable-next-line no-prototype-builtins
      if (jsonLangData.hasOwnProperty(lang)) {
        const bundle = {
          lng: lang,
          ns: 'translation',
          resources: jsonLangData[lang],
        }
        resourceBundles.push(bundle)
      }
    }
    return resourceBundles
  }
  return undefined
}

const getQueryUpdates = () => {
  const queryUpdates = localStorage.getItem('ecomQueryUpdates')
  if (queryUpdates) {
    return JSON.parse(queryUpdates)
  }
  return undefined
}

const getConfig = () => {
  const config = localStorage.getItem('ecomConfig')
  if (config) {
    return JSON.parse(config)
  }
  return undefined
}
