import { CartContent } from '@haus-tech/ecom-components'
import { Icon } from '../icon/Icon'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Link, useNavigate } from '@tanstack/react-router'

interface CartDropdownProps {
  dropdownEnabled?: boolean
}

export const CartDropdown = ({ dropdownEnabled = true }: CartDropdownProps) => {
  // TODO: Design cart dropdown
  const navigate = useNavigate()

  return (
    <CartContent className="CartDropdown">
      {({ activeProducts }) => {
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="dropdown-trigger"
                aria-label="Customise options"
                onClick={!dropdownEnabled ? () => navigate({ to: '/cart' }) : undefined}
              >
                <Icon name="cart" />
                <div className="cart-badge">{activeProducts.length}</div>
              </button>
            </DropdownMenu.Trigger>

            {dropdownEnabled && (
              <DropdownMenu.Content className="cart-contents" sideOffset={5}>
                <>
                  {!activeProducts || activeProducts.length === 0 ? (
                    <div className="text-center py-4 text-gray-600">Varukorgen är tom</div>
                  ) : (
                    (activeProducts ?? []).map((product) => (
                      <DropdownMenu.Item
                        key={product.id}
                        className="flex items-center space-x-4 border-b border-gray-300 p-4 relative"
                      >
                        <div className="w-25 h-25">
                          <img
                            src={product.featuredAsset?.preview + '?preset=thumb'}
                            alt={product.productVariant.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex flex-col items-start ">
                          <h3 className="text-lg font-semibold">
                            <a
                              key={product.id}
                              href={`/products/${product.productVariant.product.slug}`}
                              className="text-gray-700 hover:underline"
                            >
                              {product.productVariant.name}
                            </a>
                          </h3>
                          <p className="text-gray-600">{/* Additional information goes here */}</p>
                          <p className="text-gray-500">Antal: {product.quantity}</p>
                        </div>
                      </DropdownMenu.Item>
                    ))
                  )}
                </>
                <DropdownMenu.Item>
                  <Link to={'/checkout'}>Till kassan</Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            )}
          </DropdownMenu.Root>
        )
      }}
    </CartContent>
  )
}
