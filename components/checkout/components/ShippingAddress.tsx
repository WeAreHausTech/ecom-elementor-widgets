import {
  OrderShippingAddress as ShippingAddressWrapper,
  OrderAddress,
  CreateAddressInput,
  UseBillingAddress,
} from '@haus-tech/ecom-components'
import { Form, Formik, FormikValues } from 'formik'
import { omit, size, some } from 'lodash'
import * as Yup from 'yup'
import { Input } from '../../input/Input'
import { Button } from '../../button/Button'

interface ShippingAddressProps {
  onSuccess: () => void
  sameBillingAddress: boolean
}

const ShippingAddress = ({ onSuccess, sameBillingAddress }: ShippingAddressProps) => {
  return (
    <ShippingAddressWrapper className="ShippingAddress">
      {({ update, savedData, error, loading }) => {
        const { mutation: billingMethodMutation } = UseBillingAddress()

        const [
          updateBillingAddressFunc,
          { loading: updateBillingAddressLoading, error: updateBillingAddressError },
        ] = billingMethodMutation

        const handleSubmit = async (values: FormikValues) => {
          await update(values as CreateAddressInput)

          //set billingaddress same as shippingaddress
          if (sameBillingAddress && savedData !== null) {
            await updateBillingAddressFunc({
              variables: { input: values as CreateAddressInput },
            })
          }

          if (!updateBillingAddressLoading && !error && !updateBillingAddressError) {
            onSuccess()
          }
        }

        // Create intitialValues from savedData, if value is null, set it to empty string
        const initialValues = savedData
          ? Object.keys(omit(savedData, ['__typename', 'country'])).reduce((acc, key) => {
              acc[key] = savedData[key as keyof OrderAddress] || ''
              return acc
            }, {} as FormikValues)
          : {}

        return (
          <div>
            {error && <div className="error">{error.message}</div>}
            <Formik
              key={size(initialValues)}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => {
                return (
                  <Form className="shipping-address-form">
                    <Input label="Namn" name="fullName" errors={errors} touched={touched} />
                    <Input label="Företag" name="company" errors={errors} touched={touched} />
                    <Input label="Adress" name="streetLine1" errors={errors} touched={touched} />
                    <Input
                      label="Adress rad 2"
                      name="streetLine2"
                      errors={errors}
                      touched={touched}
                    />
                    <Input label="Stad" name="city" errors={errors} touched={touched} />
                    <Input label="Landskod" name="countryCode" errors={errors} touched={touched} />

                    <Input label="Provins" name="province" errors={errors} touched={touched} />
                    <Input label="Postnummer" name="postalCode" errors={errors} touched={touched} />
                    <Input
                      label="Telefonnummer"
                      name="phoneNumber"
                      errors={errors}
                      touched={touched}
                    />

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
    </ShippingAddressWrapper>
  )
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  company: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  streetLine1: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  streetLine2: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  city: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  province: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  postalCode: Yup.number().required('Required'),
  countryCode: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  phoneNumber: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
})

export default ShippingAddress
