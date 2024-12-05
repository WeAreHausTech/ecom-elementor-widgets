import { useEventBusOn } from '@haus-tech/ecom-components/eventbus'
import { productChannel } from '@haus-tech/ecom-components/eventbus'
import { useEffect } from 'react'

type CustomTemplateProps = {
  templateId: string
  condition:'priceIsZero'
}

const ConditionalTemplate = ({ templateId, condition }: CustomTemplateProps) => {
  const [selectedProductVariant] = useEventBusOn(productChannel, 'product:variant:selected')

  const handleTemplateRendering = () => {
    const element = document.getElementById(`ecom-elementor-template-${templateId}`)

    if (!element) return

    switch (condition) {
      case 'priceIsZero':
        element.style.display = selectedProductVariant?.price === 0 ? 'block' : 'none'
        break

      default:
        element.style.display = 'none'
        break
    }
  }

  useEffect(() => {
    if (templateId && condition) {
      handleTemplateRendering()
    }
  }),
    [templateId, condition, selectedProductVariant]

  return null
}

export default ConditionalTemplate
