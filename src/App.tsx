import { useEffect } from 'react'
import { sampleChannel } from './eventbus/channels/sample-channel'
import { OrderLines, ProductDetail } from './components'

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

      <ProductDetail id="34">
        <div className="flex">
          <ProductDetail.ImageSlider className="w-1/2" style={{ height: '50vw' }} />
          <div className="w-1/2">
            <ProductDetail.Content>
              {({ product }) => {
                return <>{product.name}</>
              }}
            </ProductDetail.Content>
            <ProductDetail.AddToCart />
          </div>
        </div>
      </ProductDetail>

      <div className="mt-8">
        <OrderLines>
          {({ orderLines }) => {
            return orderLines.map((orderLine) => {
              return (
                <OrderLines.Item key={orderLine.id} orderLine={orderLine}>
                  <OrderLines.Image orderLine={orderLine} />
                  {orderLine.productVariant.name}
                  <OrderLines.Quantity orderLine={orderLine} />
                  <OrderLines.Remove orderLine={orderLine} />
                </OrderLines.Item>
              )
            })
          }}
        </OrderLines>
      </div>
    </div>
  )
}
