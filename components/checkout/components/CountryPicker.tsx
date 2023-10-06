import { useAvailbleCountries } from '@haus-tech/ecom-components'
import { useState } from 'react'
import { Button } from '../../button/Button'

interface CountryPickerProps {
  onSuccess: () => void
  selectedCountry?: string
  setSelectedCountry?: (country: string) => void
}

const CountryPicker = ({ onSuccess, selectedCountry, setSelectedCountry }: CountryPickerProps) => {
  const { query: countries } = useAvailbleCountries()
  const [error, setError] = useState<boolean>(false)

  const submit = () => {
    if (!selectedCountry) {
      setError(true)
      return
    }

    onSuccess()
  }

  if (!countries) return <div>Laddar</div>
  return (
    <div className="country-picker">
      <div>
        <label htmlFor="country">Land</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry && setSelectedCountry(e.target.value)}
        >
          <option key={''} value={''}>
            Välj land
          </option>
          {countries.map((country) => (
            <option key={country.id} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {error && <div className="error">Vänligen välj ett land</div>}
      </div>
      <div>
        <Button color="blue" onClick={submit} disabled={!selectedCountry}>
          {!countries ? 'Laddar...' : 'Fortsätt'}
        </Button>
      </div>
    </div>
  )
}
export default CountryPicker
