import { VendureApolloProvider } from '@haus-tech/ecom-components'
import { Outlet, RootRoute, Route, Router, RouterProvider } from '@tanstack/react-router'
import { Products } from './pages/Products'

function App() {
  const rootRoute = new RootRoute({
    component: () => (
      <div>
        <header>
          <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
            Header
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
    component: () => <Products />,
  })

  const routeTree = rootRoute.addChildren([indexRoute])

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
