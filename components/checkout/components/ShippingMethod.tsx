import { ShippingMethod as ShippingMethodWrapper } from '@haus-tech/ecom-components'
import { Form, Formik, Field } from 'formik'
import { size, some } from 'lodash'
import { Button } from '../../button/Button'
interface ShippingMethodProps {
  onSuccess: () => void
}

const ShippingMethod = ({ onSuccess }: ShippingMethodProps) => {
  return (
    <ShippingMethodWrapper className="ShippingMethod">
      {({
        eligibleShippingMethods,
        setSelectedshippingMethod,
        updateShippingMethod,
        selectedshippingMethod,
        loading,
        error,
      }) => {
        const handleSubmit = async () => {
          await updateShippingMethod()

          if (!error) {
            onSuccess()
          }
        }

        const initialValues = {}

        const update = async (e: React.FormEvent<HTMLInputElement>) => {
          e.preventDefault()
          const element = e.currentTarget as HTMLInputElement
          setSelectedshippingMethod(element.value)
        }

        if (!eligibleShippingMethods || eligibleShippingMethods.length === 0)
          return <div>Finns inga leveransmetoder</div>

        return (
          <div>
            {error && <div className="error">{error.message}</div>}
            <Formik key={size(initialValues)} initialValues={initialValues} onSubmit={handleSubmit}>
              {({ errors, touched }) => {
                if (!eligibleShippingMethods) return

                return (
                  <Form className="shippinf-method-form">
                    {eligibleShippingMethods.map((method) => (
                      <label key={method.id}>
                        <Field
                          touched={touched}
                          error={errors}
                          type="radio"
                          name="shippingMethod"
                          id={method.id}
                          value={method.id}
                          onChange={(e: React.FormEvent<HTMLInputElement>) => update(e)}
                          checked={selectedshippingMethod === method.id}
                        />
                        {method.name}
                      </label>
                    ))}

                    <div>
                      <Button
                        color="blue"
                        type="submit"
                        disabled={some(loading, (value) => value === true)}
                      >
                        {some(loading, (value) => value === true) ? 'Laddar...' : 'Fortsätt'}
                      </Button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        )
      }}
    </ShippingMethodWrapper>
  )
}
export default ShippingMethod
