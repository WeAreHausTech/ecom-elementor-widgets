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

function App() {
  const rootRoute = new RootRoute({
    component: () => (
      <div>
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
        <div className="container mx-auto px-4 lg:px-6 py-2.5">
          <Outlet />
        </div>
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
    path: '/checkout',
    component: () => <CheckoutPage />,
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