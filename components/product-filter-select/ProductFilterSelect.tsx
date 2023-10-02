import { SearchResultSortParameter } from '@haus-tech/ecom-components'
import * as RadixSelect from '@radix-ui/react-select'
import classnames from 'classnames'
import { ForwardedRef, ReactNode, forwardRef } from 'react'
import { Icon } from '../icon/Icon'
import { Button } from '../button/Button'

interface ProductFilterSelectProps extends RadixSelect.SelectProps {
  options: { label: string; value: string | SearchResultSortParameter }[]
}

export const ProductFilterSelect = ({
  options,
  defaultValue,
  onValueChange,
}: ProductFilterSelectProps) => {
  return (
    <RadixSelect.Root defaultValue={defaultValue} onValueChange={onValueChange} defaultOpen open>
      <RadixSelect.Trigger className="SelectTrigger" aria-label="Food" asChild>
        <Button className="SelectButton" variant="default" rounded="full" color="blue">
          <RadixSelect.Value className="SelectValue" />
          <RadixSelect.Icon className="SelectIcon">
            <Icon name="chevron-down" />
          </RadixSelect.Icon>
        </Button>
      </RadixSelect.Trigger>
      <RadixSelect.Content className="SelectContent">
        <RadixSelect.ScrollUpButton className="SelectScrollButton">
          <Icon name="chevron-up" />
        </RadixSelect.ScrollUpButton>
        <RadixSelect.Viewport className="SelectViewport">
          {options.map((option, idx) => (
            <SelectItem key={idx} value={JSON.stringify(option.value)}>
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
