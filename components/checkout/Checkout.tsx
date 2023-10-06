import * as Accordion from '@radix-ui/react-accordion'
import classNames from 'classnames'
import { ForwardedRef, Suspense, forwardRef, useMemo, useState } from 'react'
import { includes } from 'lodash'
import { Icon } from '../icon/Icon'
import CustomerInformation from './components/CustomerInformation'
import Address from './components/Address'
import CompleteOrder from './components/CompleteOrder'
import CountryPicker from './components/CountryPicker'

export const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<string>('country-picker')
  const [finishedSteps, setFinishedSteps] = useState<string[]>([])
  const [success, setSuccess] = useState<boolean>(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const handleNextClick = () => {
    const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
    const nextStep = steps[currentStepIndex + 1]

    if (currentStepIndex === steps.length - 1) {
      setSuccess(true)
    }

    if (nextStep) {
      setCurrentStep(nextStep.id)
    }

    setFinishedSteps([...finishedSteps, currentStep])
  }

  // TODO: This should depend on state of the user?
  const steps = useMemo(() => {
    return [
      {
        title: 'Leverans till land',
        id: 'country-picker',
        component: CountryPicker,
      },

      {
        title: 'Leveransadress',
        id: 'shipping-adress',
        component: Address,
      },
      {
        title: 'Kontaktuppgifter',
        id: 'customer-information',
        component: CustomerInformation,
      },
      {
        title: 'Slutför beställning',
        id: 'payment',
        component: CompleteOrder,
      },
    ]
  }, [])

  return (
    <>
      {!success ? (
        <>
          <Accordion.Root className="Checkout" type="single" value={currentStep} collapsible>
            {steps.map((step, idx) => {
              const Element = step.component
              return (
                <Accordion.Item
                  key={step.id}
                  value={step.id}
                  className={classNames('checkout-step', {
                    current: currentStep === step.id,
                  })}
                >
                  <AccordionTrigger
                    className={classNames('checkout-step-trigger', {
                      current: currentStep === step.id,
                    })}
                  >
                    <div className="checkout-step-value">
                      <div className={classNames('checkout-step-number')}>
                        {includes(finishedSteps, step.id) ? <Icon name="check" /> : idx + 1}
                      </div>
                      <div className="checkout-step-title">{step.title}</div>
                    </div>
                    {includes(finishedSteps, step.id) && (
                      <button
                        className="checkout-step-edit"
                        onClick={() => setCurrentStep(step.id)}
                      >
                        Ändra
                      </button>
                    )}
                  </AccordionTrigger>
                  <Accordion.Content className="checkout-step-content">
                    <Suspense fallback={<div>Loading...</div>}>
                      {Element && (
                        <Element
                          selectedCountry={selectedCountry}
                          setSelectedCountry={setSelectedCountry}
                          onSuccess={handleNextClick}
                        />
                      )}
                    </Suspense>
                  </Accordion.Content>
                </Accordion.Item>
              )
            })}
          </Accordion.Root>
        </>
      ) : (
        <div>Tack för din beställning</div>
      )}
    </>
  )
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

const AccordionTrigger = forwardRef(
  (
    { children, className, ...props }: AccordionTriggerProps,
    forwardedRef: ForwardedRef<HTMLButtonElement>,
  ) => (
    <Accordion.Header className="checkout-step-header">
      <Accordion.Trigger className={className} {...props} ref={forwardedRef}>
        {children}
      </Accordion.Trigger>
    </Accordion.Header>
  ),
)
