import { Field, FieldAttributes, FormikErrors, FormikTouched, FormikValues } from 'formik'

type InputProps = FieldAttributes<unknown> & {
  label: string
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

export const Input = ({ label, ...rest }: InputProps) => {
  return (
    <div className="Input">
      <label htmlFor={rest.name}>{label}</label>
      <Field {...rest} />
      {rest.errors?.[rest.name] && rest.touched?.[rest.name] ? (
        <div className="error">{rest.errors[rest.name] as string}</div>
      ) : null}
    </div>
  )
}
