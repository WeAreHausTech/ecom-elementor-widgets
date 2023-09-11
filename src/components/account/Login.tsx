import type { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { LOGIN } from '@/providers/vendure/account/account'
import { useState } from 'react'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { FetchResult } from '@apollo/client'
import { LoginMutation, LoginMutationVariables } from '@/gql/graphql'

interface LoginProps extends CustomHTMLElement {
  children: (props: {
    loading: Loading<'auth:login'>
    error: GenericApolloError
    formData: LoginMutationVariables
    setFormData: (data: LoginMutationVariables) => void
    authenticate: () => Promise<FetchResult<LoginMutation>>
  }) => React.ReactNode
}

export const Login = ({ wrapperTag: Wrapper = 'div', children, ...rest }: LoginProps) => {
  const [formData, setFormData] = useState<LoginMutationVariables>({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [authenticate, { error, loading }] = useCustomMutation(LOGIN, {
    variables: formData,
  })

  return (
    <Wrapper {...rest}>
      {children({
        loading: { 'auth:login': loading },
        error,
        formData,
        setFormData,
        authenticate,
      })}
    </Wrapper>
  )
}
