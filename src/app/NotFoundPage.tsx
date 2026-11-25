import { Link } from 'react-router'
import { EmptyState } from '../shared/ui/AsyncState'

export default function NotFoundPage() {
  return (
    <EmptyState title="Сторінку не знайдено (404)">
      <Link to="/books" className="text-indigo-600 hover:underline dark:text-indigo-400">
        Повернутися до каталогу
      </Link>
    </EmptyState>
  )
}
