import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-800 hover:text-gray-600">
          AmDm Guitar Chords
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Главная
          </Link>
          <Link
            to="/artists/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Создать артиста
          </Link>
          <Link
            to="/songs/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Создать песню
          </Link>
        </nav>
      </div>
    </header>
  )
}
