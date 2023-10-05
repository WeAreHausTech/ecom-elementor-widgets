import {
  OrderBillingAddress as BillingAddressWrapper,
  OrderAddress,
  CreateAddressInput,
  useShippingAddress,
  useBillingAddress,
} from '@haus-tech/ecom-components'
import { Form, Formik, FormikValues } from 'formik'
import { omit, size, some } from 'lodash'
import * as Yup from 'yup'
import { Input } from '../../input/Input'
import { Button } from '../../button/Button'
import { useState } from 'react'

interface BillingAddressProps {
  onSuccess: () => void
  sameBillingAddress?: boolean
  shippingAddress?: boolean
  billingAddress?: boolean
}

const AddressFields = ({ onSuccess }: BillingAddressProps) => {
  const [addSeperateShippingAddress, setAddSeperateShippingAddress] = useState<boolean>(false)

  const { mutation: shippingAddressMutation, query: shippingAddressData } = useShippingAddress()
  const { mutation: billingAddressMutation, query: billingAddressData } = useBillingAddress()

  const [
    updateShippingAddressFunc,
    { loading: updateShippingAddressLoading, error: updateShippingAddressError },
  ] = shippingAddressMutation

  const [
    updateBillingAddressFunc,
    { loading: updateBillingAddressLoading, error: updateBillingAddressError },
  ] = shippingAddressMutation

  const handleSubmit = (values: FormikValues) => {
    updateShippingAddressFunc({
      variables: { input: values as CreateAddressInput },
    })

    if (!addSeperateShippingAddress) {
      updateBillingAddressFunc({
        variables: { input: values as CreateAddressInput },
      })
    }
  }

  const initialValuesBilling = shippingAddressData
    ? Object.keys(omit(shippingAddressData, ['__typename', 'country'])).reduce((acc, key) => {
        acc[key] = shippingAddressData[key as keyof OrderAddress] || ''
        return acc
      }, {} as FormikValues)
    : {}

  const initialValuesShipping = shippingAddressData
    ? Object.keys(omit(shippingAddressData, ['__typename', 'country'])).reduce((acc, key) => {
        acc[key] = shippingAddressData[key as keyof OrderAddress] || ''
        return acc
      }, {} as FormikValues)
    : {}

  return (
    <div>
      {/* {error && <div className="error">{error.message}</div>} */}
      <Formik
        key={size(initialValuesBilling)}
        initialValues={initialValuesBilling}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => {
          return (
            <Form className="billing-address-form">
              <Input label="Företag" name="company" errors={errors} touched={touched} />
              <Input label="Namn" name="fullName" errors={errors} touched={touched} />
              <Input label="Adress" name="streetLine1" errors={errors} touched={touched} />
              <Input label="Postnummer" name="postalCode" errors={errors} touched={touched} />
              <Input label="Stad" name="city" errors={errors} touched={touched} />
              <Input label="Landskod" name="countryCode" errors={errors} touched={touched} />

              <div>
                <Button
                  color="blue"
                  type="submit"
                  // disabled={some(loading, (value) => value === true)}
                >
                  Fortsätt
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>

      <div className="addressCheckbox">
        <label>
          <input
            type="checkbox"
            checked={addSeperateShippingAddress}
            onChange={() => setAddSeperateShippingAddress(!addSeperateShippingAddress)}
          />{' '}
          Jag har separat faktureringsadress
        </label>
      </div>

      {addSeperateShippingAddress && (
        <Formik
          key="shippingForm"
          initialValues={initialValuesShipping}
          validationSchema={initialValuesShipping}
          onSubmit={handleSubmit}
        >
          {({ errors: shippingErrors, touched: shippingTouched }) => (
            <Form className="shipping-address-form">
              {/* Your separate shipping form fields go here */}
              <div>
                <Button color="blue" type="submit">
                  Fortsätt
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Vänligen fyll i namn'),
  company: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Vänligen fyll i företag'),
  streetLine1: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Vänligen fyll i address'),
  city: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Vänligen fyll i stad'),
  province: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
  postalCode: Yup.number().required('Vänligen fyll i postnummer'),
  countryCode: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Vänligen fyll i landskod'),
  phoneNumber: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Vänligen fyll i telefonummer'),
})

export default AddressFields
