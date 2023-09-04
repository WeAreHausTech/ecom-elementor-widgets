import { sampleChannel } from '@/eventbus/channels/sample-channel'
import { searchFilterChannel } from '@/eventbus/channels/search-filter-channel'
import { SortOrder } from '@/gql/graphql'

export const SampleComponent = () => {
  const onButtonClick = () => {
    sampleChannel.emit('onSample', { message: 'Hello from SampleComponent' })
    searchFilterChannel.emit('onSort', { price: SortOrder.Asc })
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
