import { useEventBusOn } from '@haus-tech/ecom-components/eventbus'
import { productChannel } from '@haus-tech/ecom-components/eventbus'
import { useEffect } from 'react'
import { ConditionalTemplateProps } from '../widgets-renderer'
import { ProductVariant } from '@haus-tech/ecom-components'

type CustomTemplateProps = {
  templateId: string
  selectedCondition: 'priceIsZero'
  customConditions: ConditionalTemplateProps['conditions'] | undefined
}

const conditions: ConditionalTemplateProps['conditions'] = [
  {
    key: 'priceIsZero',
    condition: (selectedProductVariant: ProductVariant | null | undefined) =>
      selectedProductVariant?.price === 0 ? true : false
  },
]

const ConditionalTemplate = ({
  templateId,
  selectedCondition,
  customConditions,
}: CustomTemplateProps) => {
  const [selectedProductVariant] = useEventBusOn(productChannel, 'product:variant:selected')

  const handleConditions = (
    conditions: ConditionalTemplateProps['conditions'],
    templateId: string,
  ) => {
    const element = document.getElementById(`ecom-elementor-template-${templateId}`)

    if (!element) return

    const condition = conditions.find((c) => c.key === selectedCondition)

    if (condition) {
      element.style.display = condition.condition(selectedProductVariant) ? 'block' : 'none'
    }
  }

  useEffect(() => {
    const allConditions = [...conditions, ...(customConditions || [])]

    if (allConditions && allConditions.length) {
      handleConditions(allConditions, templateId)
    }
  }),
    [templateId, selectedCondition, selectedProductVariant, customConditions]

  return null
}

export default ConditionalTemplate
