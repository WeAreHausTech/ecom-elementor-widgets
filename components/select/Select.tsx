import * as RadixSelect from '@radix-ui/react-select'
import classnames from 'classnames'
import { ForwardedRef, ReactNode, forwardRef } from 'react'
import { Icon } from '../icon/Icon'
import { SearchResultSortParameter } from '@haus-tech/ecom-components'
import { Button, ButtonProps } from '../button/Button'

interface SelectProps extends RadixSelect.SelectProps {
  options: { label: string; value: string | SearchResultSortParameter }[]
  triggerProps?: Omit<ButtonProps, 'children'>
}

export const Select = ({
  options,
  defaultValue,
  onValueChange,
  triggerProps,
  ...rest
}: SelectProps) => {
  return (
    <RadixSelect.Root defaultValue={defaultValue} onValueChange={onValueChange} {...rest}>
      <RadixSelect.Trigger className="SelectTrigger" aria-label="Select" asChild>
        <Button {...triggerProps}>
          <RadixSelect.Value placeholder="Select…" />
          <RadixSelect.Icon className="SelectIcon">
            <Icon name="chevron-down" />
          </RadixSelect.Icon>
        </Button>
      </RadixSelect.Trigger>
      <RadixSelect.Content className="SelectContent" position="popper" sideOffset={8}>
        <RadixSelect.ScrollUpButton className="SelectScrollButton">
          <Icon name="chevron-up" />
        </RadixSelect.ScrollUpButton>
        <RadixSelect.Viewport className="SelectViewport">
          {options.map((option, idx) => (
            <SelectItem
              key={idx}
              value={typeof option.value === 'string' ? option.value : JSON.stringify(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </RadixSelect.Viewport>
        <RadixSelect.ScrollDownButton className="SelectScrollButton">
          <Icon name="chevron-down" />
        </RadixSelect.ScrollDownButton>
      </RadixSelect.Content>
    </RadixSelect.Root>
  )
}

interface SelectItemProps {
  children: ReactNode
  className?: string
  value: string
}

const SelectItem = forwardRef(
  (
    { children, className, value, ...props }: SelectItemProps,
    forwardedRef: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <RadixSelect.Item
        className={classnames('SelectItem', className)}
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        <RadixSelect.ItemIndicator className="SelectItemIndicator">
          <Icon name="check" />
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    )
  },
)
