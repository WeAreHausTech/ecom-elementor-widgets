import {
  BuilderQueryUpdates,
  DataProvider,
  LocalizationProvider,
  VendureOptions,
} from '@haus-tech/ecom-components'
import React, { ReactNode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import ecomWidgets from './widgets'
import { camelCase } from 'lodash'
import styles from '@haus-tech/ecom-components/dist/ecom-style.css?url'

export interface IWidgetsRendererOptions {
  provider: 'vendure'
  updates: BuilderQueryUpdates
  options: VendureOptions
}

export interface ResourceBundle {
  lng: string
  ns: string
  resources: Record<string, unknown>
}

export class WidgetsRenderer {
  provider: 'vendure'
  updates: BuilderQueryUpdates
  options: VendureOptions
  widgets: Record<string, () => JSX.Element> = {}
  translations: ResourceBundle[] = []

  constructor(
    { provider, updates, options }: IWidgetsRendererOptions,
    widgets?: Record<string, () => JSX.Element>,
    translations?: ResourceBundle[],
  ) {
    this.provider = provider
    this.updates = updates
    this.options = options
    this.widgets = widgets || {}
    this.translations = translations || []
  }

  async fetchCSSContent() {
    const response = await fetch(styles)
    return await response.text()
  }

  async renderElement(element: Element, children: ReactNode) {
    const css = await this.fetchCSSContent()
    const shadowRoot = element.attachShadow({ mode: 'open' })

    const styleEl = document.createElement('style')
    styleEl.textContent = css
    shadowRoot.appendChild(styleEl)

    return ReactDOM.createRoot(shadowRoot).render(
      <React.StrictMode>
        <DataProvider provider={this.provider} updates={this.updates} options={this.options}>
          <LocalizationProvider resourceBundles={this.translations}>
            {children}
          </LocalizationProvider>
        </DataProvider>
      </React.StrictMode>,
    )
  }

  renderElements() {
    const allWidgets = {
      ...ecomWidgets,
      ...this.widgets,
    }
    const elements: Element[] = Array.from(document.getElementsByClassName('ecom-components-root'))
    elements.forEach((element: Element) => {
      const dataAttributes = element.attributes
      const widgetType = dataAttributes.getNamedItem('data-widget-type')?.value

      if (widgetType) {
        const widget = allWidgets[camelCase(widgetType) as keyof typeof ecomWidgets]
        if (widget) {
          const widgetElement = widget(dataAttributes)
          this.renderElement(element, <Suspense>{widgetElement}</Suspense>)
        }
      }
    })
  }

  init() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    if (document.readyState !== 'loading') {
      this.renderElements()
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        _this.renderElements()
      })
    }
  }
}
