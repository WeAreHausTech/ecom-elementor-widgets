import { withAuthCheck } from '@haus-tech/ecom-components/hooks'
import { FC } from 'react'

const AuthChecker: FC = withAuthCheck(
  () => {
    return null
  },
  () => window.location.reload(),
)

export default AuthChecker
