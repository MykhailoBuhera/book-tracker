import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../shared/ui/Button'
import { Field } from '../../../shared/ui/Field'
import { bookSearchSchema, type BookSearchFormValues } from '../model/search-params'
import { SORT_OPTIONS, SUBJECTS } from '../model/types'

interface BookSearchFormProps {
  defaultValues: BookSearchFormValues
  onSubmit: (values: BookSearchFormValues) => void
}

export function BookSearchForm({ defaultValues, onSubmit }: BookSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookSearchFormValues>({ resolver: zodResolver(bookSearchSchema), defaultValues })

  return (
    <form
      role="search"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-start dark:bg-slate-800"
    >
      <Field label="Назва або автор" htmlFor="search-q" error={errors.q?.message}>
        <input
          id="search-q"
          type="search"
          placeholder="Напр. Tolkien"
          className="input"
          aria-invalid={Boolean(errors.q)}
          aria-describedby={errors.q ? 'search-q-error' : undefined}
          {...register('q')}
        />
      </Field>

      <Field label="Жанр" htmlFor="search-subject">
        <select id="search-subject" className="input" {...register('subject')}>
          <option value="">Усі жанри</option>
          {Object.entries(SUBJECTS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Сортування" htmlFor="search-sort">
        <select id="search-sort" className="input" {...register('sort')}>
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Button type="submit" className="sm:mt-6">
        Знайти
      </Button>
    </form>
  )
}
