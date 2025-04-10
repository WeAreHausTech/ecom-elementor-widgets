import { productChannel, useEventBusOn } from '@haus-storefront/core'
import { useCallback, useLayoutEffect, useMemo } from 'react'
import { ConditionalTemplateProps } from '../widgets-renderer'
import { Customer, Maybe, Order, ProductVariant } from '@haus-storefront/shared-types'
import { useActiveCustomer, useActiveOrder, useProductDetail } from '@haus-storefront/hooks'

type CustomTemplateProps = {
  templateId?: string
  templateIdFalse?: string
  selectedCondition: 'priceIsZero'
  customConditions: ConditionalTemplateProps['conditions'] | undefined
  productId?: string
}

const defaultConditions: ConditionalTemplateProps['conditions'] = {
  priceIsZero: {
    inputType: 'productVariant',
    fn: (input: Maybe<ProductVariant>) => input?.price !== undefined && Number(input.price) === 0,
  },
  cartIsEmpty: {
    inputType: 'activeOrder',
    fn: (input: Maybe<Order>) => !input?.lines?.length,
  },
  userIsLoggedIn: {
    inputType: 'activeCustomer',
    fn: (input: Maybe<Customer>) => input !== null,
  },
}

const ConditionalTemplate = ({
  templateId,
  templateIdFalse,
  selectedCondition,
  customConditions,
  productId,
}: CustomTemplateProps) => {
  const [selectedProductVariant] = useEventBusOn(productChannel, 'product:variant:selected')

  const inputType = useMemo(() => {
    const allConditions = {
      ...defaultConditions,
      ...(customConditions || {}),
    }
    return allConditions[selectedCondition]?.inputType
  }, [selectedCondition, customConditions])

  const { data: product } = useProductDetail(
    { id: productId ?? '' },
    inputType === 'product' && !!productId,
  )

  const { data: activeCustomer } = useActiveCustomer({
    enabled: inputType === 'activeCustomer',
  })

  const { data: activeOrder } = useActiveOrder({
    enabled: inputType === 'activeOrder',
  })

  const handleConditions = useCallback(
    (conditions: ConditionalTemplateProps['conditions']) => {
      const inputTypes = {
        productVariant: selectedProductVariant,
        product,
        activeOrder,
        activeCustomer,
      }

      const element = document.getElementById(`ecom-elementor-template-${templateId}`)
      const elementFalse = document.getElementById(`ecom-elementor-template-${templateIdFalse}`)
      const condition = conditions[selectedCondition]

      if (!element && !elementFalse) return
      if (!condition) return

      const conditionValue = condition.fn(inputTypes[condition.inputType] as never)

      if (conditionValue) {
        if (element) {
          element.style.display = 'block'
        }
        if (elementFalse) {
          elementFalse.style.display = 'none'
        }
      } else {
        if (element) {
          element.style.display = 'none'
        }
        if (elementFalse) {
          elementFalse.style.display = 'block'
        }
      }
    },
    [
      selectedProductVariant,
      product,
      activeOrder,
      templateId,
      templateIdFalse,
      selectedCondition,
      activeCustomer,
    ],
  )

  useLayoutEffect(() => {
    const allConditions = {
      ...defaultConditions,
      ...(customConditions || {}),
    }

    handleConditions(allConditions)
  }, [customConditions, handleConditions])

  return null
}

export default ConditionalTemplate
