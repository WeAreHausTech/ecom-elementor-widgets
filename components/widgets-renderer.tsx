import { BuilderQueryUpdates, VendureDataProviderProps } from '@haus-tech/ecom-components'
import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import ecomWidgets from './widgets'
import { camelCase, set } from 'lodash'
import css from '@haus-tech/ecom-components/dist/ecom-style.css?raw'
import { ComponentProviderProps, DataProvider } from '@haus-tech/ecom-components/providers'

export interface IWidgetsRendererOptions {
  provider: 'vendure'
  updates: BuilderQueryUpdates
  options: VendureDataProviderProps['options']
  sdkInstance?: VendureDataProviderProps['sdkInstance']
}

export interface ResourceBundle {
  lng: string
  ns: string
  resources: Record<string, unknown>
}

export class WidgetsRenderer {
  provider: 'vendure'
  updates: BuilderQueryUpdates
  options: VendureDataProviderProps['options']
  sdkInstance: VendureDataProviderProps['sdkInstance']
  widgets: Record<string, (dataAttributes: NamedNodeMap) => JSX.Element> = {}
  translations: ResourceBundle[] = []
  customComponents: ComponentProviderProps['components']

  constructor(
    { provider, updates, options, sdkInstance }: IWidgetsRendererOptions,
    widgets?: Record<string, (dataAttributes: NamedNodeMap) => JSX.Element>,
    translations?: ResourceBundle[],
    customComponents?: ComponentProviderProps['components'],
  ) {
    set(options, 'localizationProviderProps.resourceBundles', translations)
    set(options, 'customComponents', customComponents)

    this.provider = provider
    this.updates = updates
    this.options = options
    this.sdkInstance = sdkInstance
    this.widgets = widgets || {}
    this.translations = translations || []
    this.customComponents = customComponents || []
  }

  // private async fetchCSSContent() {
  //   const response = await fetch(styles)
  //   return await response.text()
  // }

  private async renderElement(element: Element, children: ReactNode) {
    // const css = await this.fetchCSSContent()
    const shadowRoot = element.attachShadow({ mode: 'open' })

    const styleEl = document.createElement('style')
    styleEl.textContent = css
    shadowRoot.appendChild(styleEl)

    return ReactDOM.createRoot(shadowRoot).render(
      <React.StrictMode>
        <DataProvider
          provider={this.provider}
          updates={this.updates}
          options={this.options}
          sdkInstance={this.sdkInstance}
        >
          {children}
        </DataProvider>
      </React.StrictMode>,
    )
  }

  private renderElements(parentElement: ParentNode = document) {
    const elements: Element[] = Array.from(
      (parentElement as Element).getElementsByClassName('ecom-components-root'),
    )
    elements.forEach((element: Element) => {
      if (element.shadowRoot) {
        return
      }
      const dataAttributes = element.attributes
      const widgetType = dataAttributes.getNamedItem('data-widget-type')?.value

      if (widgetType) {
        const ecomWidget = ecomWidgets[camelCase(widgetType) as keyof typeof ecomWidgets]
        const customerWidget = this.widgets[camelCase(widgetType) as keyof typeof this.widgets]
        if (customerWidget) {
          // console.log('customer widget', widgetType)
          const widgetElement = customerWidget(dataAttributes)
          this.renderElement(element, widgetElement)
        } else if (ecomWidget) {
          // console.log('ecom widget', widgetType)
          const widgetElement = ecomWidget(dataAttributes)
          this.renderElement(element, widgetElement)
        } else {
          console.error(`Widget ${widgetType} not found`)
        }
      }
    })
  }

  init(callback?: () => void) {
    if (document.readyState !== 'loading') {
      this.renderElements()
      this.setupObserver()
      callback?.()
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.renderElements()
        this.setupObserver()
        callback?.()
      })
    }
  }

  setupObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              const found = node.getElementsByClassName('ecom-components-root').length > 0
              if (found) {
                this.renderElements()
              }
            }
          })
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
}
