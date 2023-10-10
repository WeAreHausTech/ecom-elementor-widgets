import { VendureApolloProvider } from '@haus-tech/ecom-components'
import { Outlet, RootRoute, Route, Router, RouterProvider } from '@tanstack/react-router'
import { Icon } from '../../components/icon/Icon'
import { CartDropdown } from './pages/CartDropdown'
import { ProductsPage } from './pages/ProductsPage'
import { ProductPage } from './pages/ProductPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { SearchPage } from './pages/SearchPage'
import { LoginPage } from './pages/LoginPage'
import { CartPage } from './pages/CartPage'
import { SearchField } from '../../components/search-field/SearchField'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { CurrencySelect } from '../../components/CurrencySelect/CurrencySelect'

function App() {
  const rootRoute = new RootRoute({
    component: () => (
      <div className="flex flex-col h-screen">
        <header>
          <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 flex items-center justify-between">
            <div>LIVV</div>
            <div className="w-2/3">
              <SearchField />
            </div>
            <div className="flex space-x-4 text-2xl">
              <Icon name="avatar" />
              <CartDropdown dropdownEnabled={true} />
            </div>
          </nav>
        </header>
        <div className="container mx-auto px-4 lg:px-6 py-2.5 flex-1">
          <Outlet />
        </div>
        <footer className="bg-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 flex items-center justify-end">
          <CurrencySelect />
        </footer>
      </div>
    ),
  })

  const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <ProductsPage />,
  })

  const productRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/products/*',
    component: () => <ProductPage />,
  })

  const checkoutRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/kassa',
    component: () => <CheckoutPage />,
  })

  const orderConfirmationRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/order-confirmation',
    component: () => <OrderConfirmationPage />,
  })

  const searchRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/search',
    component: () => <SearchPage />,
  })

  const cartRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/cart',
    component: () => <CartPage />,
  })

  const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <LoginPage />,
  })

  const routeTree = rootRoute.addChildren([
    loginRoute,
    checkoutRoute,
    orderConfirmationRoute,
    searchRoute,
    cartRoute,
    indexRoute,
    productRoute,
  ])

  const router = new Router({ routeTree })

  return (
    <>
      <VendureApolloProvider apiUrl={import.meta.env.VITE_API_URL}>
        <RouterProvider router={router} />
      </VendureApolloProvider>
    </>
  )
}

export default App
