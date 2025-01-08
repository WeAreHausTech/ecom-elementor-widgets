import { useEventBusOn } from '@haus-tech/ecom-components/eventbus'
import { productChannel } from '@haus-tech/ecom-components/eventbus'
import { useCallback, useEffect } from 'react'
import { ConditionalTemplateProps } from '../widgets-renderer'
import { Maybe, ProductVariant } from '@haus-tech/ecom-components'
import { useProductDetail } from '@haus-tech/ecom-components/hooks'

type CustomTemplateProps = {
  templateId: string
  selectedCondition: 'priceIsZero'
  customConditions: ConditionalTemplateProps['conditions'] | undefined
  productId: string
  productSlug?: string
}

const defaultConditions: ConditionalTemplateProps['conditions'] = {
  priceIsZero: {
    inputType: 'productVariant',
    fn: (input: Maybe<ProductVariant>) => input?.price !== undefined && Number(input.price) === 0,
  },
}

const ConditionalTemplate = ({
  templateId,
  selectedCondition,
  customConditions,
  productId,
  productSlug,
}: CustomTemplateProps) => {
  const [selectedProductVariant] = useEventBusOn(productChannel, 'product:variant:selected')

  const { data: product } = useProductDetail(
    productId ? { id: productId } : { slug: productSlug! },
    !selectedProductVariant,
  )

  const handleConditions = useCallback(
    (conditions: ConditionalTemplateProps['conditions'], templateId: string) => {
      const inputTypes = {
        productVariant: selectedProductVariant,
        product: product,
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
    [selectedCondition, selectedProductVariant, product],
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
