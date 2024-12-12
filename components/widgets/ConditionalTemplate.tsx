import { useEventBusOn } from '@haus-tech/ecom-components/eventbus'
import { productChannel } from '@haus-tech/ecom-components/eventbus'
import { useCallback, useEffect } from 'react'
import { ConditionalTemplateProps } from '../widgets-renderer'
import { Maybe, ProductVariant } from '@haus-tech/ecom-components'

type CustomTemplateProps = {
  templateId: string
  selectedCondition: 'priceIsZero'
  customConditions: ConditionalTemplateProps['conditions'] | undefined
}

const defaultConditions: ConditionalTemplateProps['conditions'] = {
  priceIsZero: {
    inputType: 'productVariant',
    fn: (input: Maybe<ProductVariant>) => input?.price === 0,
  },
}

const ConditionalTemplate = ({
  templateId,
  selectedCondition,
  customConditions,
}: CustomTemplateProps) => {
  const [selectedProductVariant] = useEventBusOn(productChannel, 'product:variant:selected')

  const handleConditions = useCallback(
    (conditions: ConditionalTemplateProps['conditions'], templateId: string) => {
      const inputTypes = {
        productVariant: selectedProductVariant,
      }

      const element = document.getElementById(`ecom-elementor-template-${templateId}`)

      if (!element) return

      const condition = conditions[selectedCondition]

      if (condition) {
        element.style.display = condition.fn(inputTypes[condition.inputType] as never)
          ? 'block'
          : 'none'
      }
    },
    [selectedCondition, selectedProductVariant],
  )

  useEffect(() => {
    const allConditions = {
      ...defaultConditions,
      ...(customConditions || {}),
    }

    handleConditions(allConditions, templateId)
  }, [templateId, customConditions, handleConditions])

  return null
}

export default ConditionalTemplate
