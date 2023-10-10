import {
  OrderCustomer as OrderCustomerWrapper,
  CreateCustomerInput,
  isError,
} from '@haus-tech/ecom-components'
import { Form, Formik, FormikValues } from 'formik'
import { some } from 'lodash'
import * as Yup from 'yup'
import { Input } from '../../input/Input'
import { Button } from '../../button/Button'

interface CustomerInformationProps {
  onSuccess: () => void
  selectedCountry?: string
  setSelectedCountry?: (country: string) => void
}

const CustomerInformation = ({ onSuccess }: CustomerInformationProps) => {
  return (
    <OrderCustomerWrapper className="CustomerInformation">
      {({ update, savedData, error, loading }) => {
        const initialValues = {
          firstName: savedData?.firstName || '',
          lastName: savedData?.lastName || '',
          emailAddress: savedData?.emailAddress || '',
          phoneNumber: savedData?.phoneNumber || '',
        }

        const handleSubmit = async (values: FormikValues) => {
          const { data } = await update(values as CreateCustomerInput)

          if (!isError(data) && !loading['order:updateCustomer'] && data) {
            onSuccess()
          }
        }

        return (
          <div>
            {error && <div className="error">{error.message}</div>}
            <Formik
              key={savedData?.id}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => {
                return (
                  <Form className="billing-address-form">
                    <Input label="Förnamn" name="firstName" errors={errors} touched={touched} />
                    <Input label="Efternamn" name="lastName" errors={errors} touched={touched} />
                    <Input label="E-post" name="emailAddress" errors={errors} touched={touched} />
                    <Input label="Telefon" name="phoneNumber" errors={errors} touched={touched} />

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
    </OrderCustomerWrapper>
  )
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Vänligen fyll i förnamn'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Vänligen fyll i efternamn'),
  emailAddress: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Vänligen fyll i e-post'),
  phoneNumber: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Vänligen fyll i telefonnummer'),
})

export default CustomerInformation
