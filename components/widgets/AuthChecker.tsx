import { withAuthCheck } from '@haus-tech/ecom-components/hooks'

const AuthChecker = withAuthCheck(
  () => {
    return null
  },
  () => window.location.reload(),
)

export default AuthChecker
