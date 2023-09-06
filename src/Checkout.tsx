import { OrderShippingAddress } from '@haus-tech/ecom-components'

export default function Checkout() {
  return (
    <div>
      <h2 className="mb-2 text-left text-gray-900 font-bold text-3xl">Checkout</h2>
      <OrderShippingAddress>
        {({ formData, handleChange, handleSubmit }) => {
          return !formData ? (
            <div>Loading...</div>
          ) : (
            <div className="shipping-address bg-white p-4">
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md max-w-md">
                <h3 className="text-lg font-semibold mb-2">Company information</h3>
                <label className="block mb-4">
                  Company:
                  <input
                    type="text"
                    name="company"
                    value={formData.company!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Street Line 1:
                  <input
                    type="text"
                    name="streetLine1"
                    value={formData.streetLine1!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  City:
                  <input
                    type="text"
                    name="city"
                    value={formData.city!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Street Line 2:
                  <input
                    type="text"
                    name="streetLine2"
                    value={formData.streetLine2!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Province:
                  <input
                    type="text"
                    name="province"
                    value={formData.province!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Postal Code:
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Country Code:
                  <input
                    type="text"
                    name="countryCode"
                    value={formData.countryCode!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <br />
                <h3 className="text-lg font-semibold mb-2">Contact information</h3>
                <label className="block mb-4">
                  Full Name:
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Phone Number:
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Uppdatera uppgifter
                </button>
              </form>
            </div>
          )
        }}
      </OrderShippingAddress>
    </div>
  )
}
