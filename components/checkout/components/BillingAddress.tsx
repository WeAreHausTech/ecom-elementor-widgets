import {
  OrderBillingAddress as BillingAddressWrapper,
  CreateAddressInput,
} from '@haus-tech/ecom-components'
import { Form, Formik, FormikValues } from 'formik'
import { omit, size, some } from 'lodash'
import * as Yup from 'yup'
import { Input } from '../../input/Input'
import { Button } from '../../button/Button'

interface BillingAddressProps {
  onSuccess: () => void
}

const BillingAddress = ({ onSuccess }: BillingAddressProps) => {
  return (
    <BillingAddressWrapper className="BillingAddress">
      {({ update, savedData, error, loading }) => {
        const handleSubmit = async (values: FormikValues) => {
          await update(values as CreateAddressInput)

          if (!error) {
            onSuccess()
          }
        }

        // Create intitialValues from savedData, if value is null, set it to empty string
        const initialValues = savedData
          ? Object.keys(omit(savedData, ['__typename', 'country'])).reduce((acc, key) => {
              acc[key] = savedData[key as keyof CreateAddressInput] || ''
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
                    <Input label="Full name" name="fullName" errors={errors} touched={touched} />
                    <Input
                      label="Phone number"
                      name="phoneNumber"
                      errors={errors}
                      touched={touched}
                    />
                    <Input label="City" name="city" errors={errors} touched={touched} />
                    <Input label="Country" name="countryCode" errors={errors} touched={touched} />

                    <div>
                      <Button
                        color="blue"
                        type="submit"
                        disabled={some(loading, (value) => value === true)}
                      >
                        {some(loading, (value) => value === true) ? 'Loading...' : 'Fortsätt'}
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
  fullName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  phoneNumber: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  city: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  countryCode: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
})

export default BillingAddress
