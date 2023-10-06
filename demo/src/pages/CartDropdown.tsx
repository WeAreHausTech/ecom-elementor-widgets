import { Icon } from '../../../components/icon/Icon'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useNavigate } from '@tanstack/react-router'
import { CartOrderLines } from '../../../components/cart-order-lines/CartOrderLines'

interface CartDropdownProps {
  dropdownEnabled?: boolean
}

export const CartDropdown = ({ dropdownEnabled = true }: CartDropdownProps) => {
  const navigate = useNavigate()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="dropdown-trigger"
          aria-label="Customise options"
          onClick={!dropdownEnabled ? () => navigate({ to: '/cart' }) : undefined}
        >
          <Icon name="cart" />
        </button>
      </DropdownMenu.Trigger>

      {dropdownEnabled && (
        <DropdownMenu.Content className="cart-contents" sideOffset={5} style={{ zIndex: 98 }}>
          <div className="cart-dropdown-demo">
            <DropdownMenu.Item>
              <CartOrderLines className="cart-dropdown" edit imageSize={[74, 74]} />
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <button className="Button blue" onClick={() => navigate({ to: '/cart' })}>
                Gå till varukorgen
              </button>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      )}
    </DropdownMenu.Root>
  )
}
