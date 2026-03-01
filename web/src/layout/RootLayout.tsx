import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col container mx-auto px-4 py-6 min-h-0">
        <Outlet />
      </main>
    </div>
  )
}
