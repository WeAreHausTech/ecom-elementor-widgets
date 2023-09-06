

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
}

export const Input = ({ ...props }: InputProps) => {

  return <input {...props} />
}
  