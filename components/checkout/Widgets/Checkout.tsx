import * as Accordion from '@radix-ui/react-accordion'
import classNames from 'classnames'
import { ForwardedRef, Suspense, forwardRef, lazy, useMemo, useState } from 'react'
import { includes } from 'lodash'
import { Icon } from '../../icon/Icon'

export const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<string>('customer-information')
  const [finishedSteps, setFinishedSteps] = useState<string[]>([])
  const [success, setSuccess] = useState<boolean>(false)

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
        title: 'Kontaktuppgifter',
        id: 'customer-information',
        component: 'CustomerInformation',
      },
      {
        title: 'Leveransadress',
        id: 'shipping-adress',
        component: 'Address',
      },
      {
        title: 'Betalning',
        id: 'payment',
        component: 'CompleteOrder',
      },
    ]
  }, [])

  return (
    <>
      {!success ? (
        <>
        <Accordion.Root className="Checkout" type="single" value={currentStep} collapsible>
          {steps.map((step, idx) => {
            const Element = lazy(() => import(`../components/${step.component}.tsx`))
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
                  onClick={() => includes(finishedSteps, step.id) && setCurrentStep(step.id)}
                >
                  <div className={classNames('checkout-step-number')}>
                    {includes(finishedSteps, step.id) ? <Icon name="check" /> : idx + 1}
                  </div>
                  <div className="checkout-step-title">{step.title}</div>
                </AccordionTrigger>
                <Accordion.Content className="checkout-step-content">
                  <Suspense fallback={<div>Loading...</div>}>
                    {step.component && <Element onSuccess={handleNextClick} />}
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