import {
    OrderCustomer as OrderCustomerWrapper,
    CreateCustomerInput,
  } from '@haus-tech/ecom-components'
  import { Form, Formik, FormikValues } from 'formik'
  import {size, some } from 'lodash'
  import * as Yup from 'yup'
  import { Input } from '../../input/Input'
  import { Button } from '../../button/Button'
  
  interface CustomerInformationProps {
    onSuccess: () => void
  }
  
  const CustomerInformation = ({ onSuccess }: CustomerInformationProps) => {
    return (
      <OrderCustomerWrapper className="CustomerInformation">
        {({ update, error, loading }) => {
          const handleSubmit = async (values: FormikValues) => {
            await update(values as CreateCustomerInput)
  
            if (!error) {
              onSuccess()
            }
          }
  
          // Create intitialValues from savedData, if value is null, set it to empty string
          const initialValues = {}
  
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
      </OrderCustomerWrapper>
    )
  }
  
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    emailAddress: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    phoneNumber: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  })
  
  export default CustomerInformation
  