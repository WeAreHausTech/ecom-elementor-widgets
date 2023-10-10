import { CurrencyChooser } from '@haus-tech/ecom-components'
import { Icon } from '../icon/Icon'

export const CurrencySelect = () => {
  return (
    <div className="CurrencySelect">
      <CurrencyChooser
        triggerComponent={
          <button className="currency-trigger">
            <CurrencyChooser.Value />
            <Icon name="chevron-down" />
          </button>
        }
        indicatorComponent={
          <div className="SelectItemIndicator">
            <Icon name="chevron-down" />
          </div>
        }
        contentClassName="SelectContent"
        viewportClassName="SelectViewport"
        optionClassName="SelectItem"
      />
    </div>
  )
}
