import { useEffect } from 'react'
import { sampleChannel } from './eventbus/channels/sample-channel'

export const App = () => {
  useEffect(() => {
    console.log('SampleComponent mounted')

    const unsubscribeSampleEventListener = sampleChannel.on('sample:message', (data) => {
      console.log('SampleComponent received sample-event', data)
    })

    return () => {
      console.log('SampleComponent unmounted')
      unsubscribeSampleEventListener()
    }
  }, [])

  return (
    <div className="App">
      <h1>Sample App</h1>
      <h3>Use this file for local development.</h3>
      <p>Remove code when done. Testing takes place in the demo-site</p>
    </div>
  )
}
