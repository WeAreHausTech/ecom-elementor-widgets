import { VendureApolloProvider } from '@haus-tech/ecom-components'
import { Outlet, RootRoute, Route, Router, RouterProvider } from '@tanstack/react-router'
import { Icon } from '../../components/icon/Icon'
import { Cart } from '../../components/cart/Cart'
import { ProductsPage } from './pages/ProductsPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { SearchPage } from './pages/SearchPage'
import { Search } from '../../components/search/Search'
import { LoginPage } from './pages/LoginPage'

function App() {
  const rootRoute = new RootRoute({
    component: () => (
      <div>
        <header>
          <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 flex items-center justify-between">
            <div>LIVV</div>
            <div className="w-2/3">
              <Search />
            </div>
            <div className="flex space-x-4 text-2xl">
              <Icon name="avatar" />
              <Cart />
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

  const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <LoginPage />,
  })

  const routeTree = rootRoute.addChildren([loginRoute, checkoutRoute, searchRoute, indexRoute])

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
