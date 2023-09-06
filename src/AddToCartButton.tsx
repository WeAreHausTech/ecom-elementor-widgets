import { useState, useEffect } from 'react'

interface Props {
  success: boolean
  addProductToCart: (productVariantId: string, quantity: number) => void
  productId: string
}

export const AddToCartButton = ({ success, addProductToCart, productId }: Props) => {
  const [successMessage, setSuccessMessage] = useState(false)

  useEffect(() => {
    if (success) {
      setSuccessMessage(true)
      setTimeout(() => {
        setSuccessMessage(false)
      }, 1000)
    }
  }, [success])
  return (
    <>
      <button
        type="submit"
        name="addToCart"
        value={'1'}
        className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none mb-4"
        onClick={() => addProductToCart(productId, 1)}
      >
        {successMessage ? 'Tillagd i varukorgen' : 'köp'}
      </button>
    </>
  )
}
