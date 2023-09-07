import { ApolloError, Loading } from '@haus-tech/ecom-components'
import { useState, useEffect } from 'react'

interface Props {
  loading: Loading
  error: ApolloError | undefined
  addProductToCart: (productVariantId: string, quantity: number) => void
  productId: string
}

export const AddToCartButton = ({ loading, addProductToCart, productId }: Props) => {
  const [btnText, setBtnText] = useState('Köp')

  useEffect(() => {
    if (loading['cart:addToCart']) {
      setBtnText('Lägger till...')
    }
    if (!loading['cart:addToCart'] && btnText !== 'Köp') {
      setBtnText('Tillagd')
      setTimeout(() => {
        setBtnText('Köp')
      }, 1000)
    }
  }, [loading, btnText])

  console.log(loading)

  return (
    <>
      <button
        type="submit"
        name="addToCart"
        value={'1'}
        className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none mb-4"
        onClick={() => addProductToCart(productId, 1)}
      >
        {btnText}
      </button>
    </>
  )
}
