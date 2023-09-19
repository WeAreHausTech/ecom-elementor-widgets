import { CartContent, Price } from '@haus-tech/ecom-components'
import { Icon } from '../icon/Icon'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useNavigate } from '@tanstack/react-router'
import { AdjustOrderLine } from '../../components/adjust-order-line/AdjustOrderLine'

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
                    <div className="">Varukorgen är tom</div>
                  ) : (
                    (activeProducts ?? []).map((product) => (
                      <DropdownMenu.Item key={product.id} className="cart-product">
                        <div className="product-data">
                          <img
                            src={product.featuredAsset?.preview + '?w=128&h=128'}
                            alt={product.productVariant.name}
                            className="cart-product-image rounded-md"
                          />
                          <div className="cart-product-details">
                            <div>
                              <p className="brand">Brand</p>
                              <p className="product-name">{product.productVariant.name}</p>
                            </div>
                          </div>
                        </div>
                        <div className="product-price">
                          <div className="adjust-orderline">
                            <AdjustOrderLine product={product} />
                          </div>
                          <Price
                            className="cart-product-price"
                            price={product.productVariant.price}
                            priceWithTax={product.productVariant.priceWithTax}
                            currencyCode={product.productVariant.currencyCode}
                          >
                            {({ formattedPrice }) => <>{formattedPrice}</>}
                          </Price>
                        </div>
                      </DropdownMenu.Item>
                    ))
                  )}
                </>
                <DropdownMenu.Item>
                  <button className="Button blue" onClick={() => navigate({ to: '/cart' })}>
                    Gå till varukorgen
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            )}
          </DropdownMenu.Root>
        )
      }}
    </CartContent>
  )
}
