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
import { useEffect, useState } from 'react'
import React, { useRef } from 'react'

interface BillingAddressProps {
  onSuccess: () => void
  submitAddress: boolean
  setSubmitAddress: (value: boolean) => void
}

const AddressFields = ({ onSuccess, submitAddress, setSubmitAddress }: BillingAddressProps) => {
  const formikRefBilling = useRef(null) // Create a ref for billing Formik form
  const formikRefShipping = useRef(null) // Create a ref for shipping Formik form

  const [addSeperateShippingAddress, setAddSeperateShippingAddress] = useState<boolean>(false)
  const { mutation: shippingAddressMutation, query: shippingAddressData } = useShippingAddress()
  const { mutation: billingAddressMutation, query: billingAddressData } = useBillingAddress()
  const initialBillingData = billingAddressData?.data?.activeOrder?.billingAddress
  const initialinitialShippingData = shippingAddressData?.data?.activeOrder?.shippingAddress

  useEffect(() => {
    if (submitAddress) {
      triggerFormSubmission()
      setSubmitAddress(false)
    }
  }, [submitAddress, setSubmitAddress])

  const [
    updateShippingAddressFunc,
    { loading: updateShippingAddressLoading, error: updateShippingAddressError },
  ] = shippingAddressMutation

  const [
    updateBillingAddressFunc,
    { loading: updateBillingAddressLoading, error: updateBillingAddressError },
  ] = billingAddressMutation

  
  const initialValuesBilling = initialBillingData
    ? Object.keys(omit(initialBillingData, ['__typename', 'country'])).reduce((acc, key) => {
        acc[key] = initialBillingData[key as keyof OrderAddress] || ''
        return acc
      }, {} as FormikValues)
    : {}

  const initialValuesShipping = initialinitialShippingData
    ? Object.keys(omit(initialinitialShippingData, ['__typename', 'country'])).reduce((acc, key) => {
        acc[key] = initialinitialShippingData[key as keyof OrderAddress] || ''
        return acc
      }, {} as FormikValues)
    : {}

  const handleSubmitBilling = (values: FormikValues) => {
    updateBillingAddressFunc({
      variables: { input: values as CreateAddressInput },
    })

    if (!addSeperateShippingAddress) {
      updateShippingAddressFunc({
        variables: { input: values as CreateAddressInput },
      })
    }

    if (
      !updateBillingAddressLoading &&
      !updateShippingAddressLoading &&
      !updateBillingAddressError &&
      !updateShippingAddressError
    ) {
      onSuccess()
    }
  }

  const handleSubmitShipping = (values: FormikValues) => {
    updateShippingAddressFunc({
      variables: { input: values as CreateAddressInput },
    })
  }

  const triggerFormSubmission = () => {
    if (addSeperateShippingAddress && formikRefShipping.current) {
      formikRefShipping.current?.handleSubmit()
    }

    if (formikRefBilling.current) {
      formikRefBilling.current.handleSubmit()
    }
  }

  const addressForm = (id: string, intitialvalues: FormikValues, ref, submit) => {
    return (
      <Formik
        id={id}
        key={size(intitialvalues)}
        initialValues={intitialvalues}
        validationSchema={validationSchema}
        onSubmit={submit}
        innerRef={ref}
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
            </Form>
          )
        }}
      </Formik>
    )
  }

  return (
    <div>
      {addressForm('billing', initialValuesBilling, formikRefBilling, handleSubmitBilling)}

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

      {addSeperateShippingAddress &&
        addressForm('shipping', initialValuesShipping, formikRefShipping, handleSubmitShipping)}
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
})

export default AddressFields
