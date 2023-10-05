import {
  OrderBillingAddress as BillingAddressWrapper,
  OrderAddress,
  CreateAddressInput,
  useShippingAddress,
} from '@haus-tech/ecom-components'
import { Form, Formik, FormikValues } from 'formik'
import { omit, size, some } from 'lodash'
import * as Yup from 'yup'
import { Input } from '../../input/Input'
import { Button } from '../../button/Button'

interface BillingAddressProps {
  onSuccess: () => void
  sameBillingAddress: boolean
}

const BillingAddress = ({ onSuccess, sameBillingAddress }: BillingAddressProps) => {
  const { mutation: shippingAddressMutation } = useShippingAddress()

  return (
    <BillingAddressWrapper className="BillingAddress">
      {({ update, savedData, error, loading }) => {
        const [
          updateShippingAddressFunc,
          { loading: updateShippingAddressLoading, error: updateShippingAddressError },
        ] = shippingAddressMutation

        const handleSubmit = async (values: FormikValues) => {
          await update(values as CreateAddressInput)

          //set billingaddress same as shippingaddress
          if (sameBillingAddress && savedData !== null) {
            await updateShippingAddressFunc({
              variables: { input: values as CreateAddressInput },
            })
          }

          if (!updateShippingAddressLoading && !updateShippingAddressError && !error) {
            onSuccess()
          }
        }

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
    </BillingAddressWrapper>
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

export default BillingAddress
