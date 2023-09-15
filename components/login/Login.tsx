import { Login as LoginWrapper, isErrorResult } from '@haus-tech/ecom-components'
import { Form, Formik } from 'formik'
import { Input } from '../input/Input'
import { Button } from '../button/Button'
import { useState } from 'react'

export const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <LoginWrapper>
      {({ error, loading, authenticate }) => {
        return (
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={async (values) => {
              setLoggedIn(false)
              const data = await authenticate({ variables: values })
              if (!isErrorResult(data.data)) {
                setLoggedIn(true)
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="billing-address-form">
                <Input label="Email" name="email" errors={errors} touched={touched} />
                <Input label="Password" name="password" errors={errors} touched={touched} />
                <Button
                  color="blue"
                  type="submit"
                  disabled={loading['auth:login']}
                  className="mt-4"
                >
                  Login
                </Button>
                {error && <div className="text-red-500">{error.message}</div>}
                {loggedIn && <div className="text-green-500">Logged in!</div>}
              </Form>
            )}
          </Formik>
        )
      }}
    </LoginWrapper>
  )
}
