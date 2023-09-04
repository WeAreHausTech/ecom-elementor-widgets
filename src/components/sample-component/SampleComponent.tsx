import { sampleChannel } from '@/eventbus/channels/sample-channel'

export const SampleComponent = () => {
  const onButtonClick = () => {
    sampleChannel.emit('onSample', { message: 'Hello from SampleComponent' })
  }

  return (
    <div className="sample-component">
      <h1>Sample Event Component</h1>
      <button className="sample-component__button" onClick={onButtonClick}>
        Click me
      </button>
    </div>
  )
}
