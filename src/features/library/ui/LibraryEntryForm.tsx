import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ErrorState } from '../../../shared/ui/AsyncState'
import { Button } from '../../../shared/ui/Button'
import { Field } from '../../../shared/ui/Field'
import {
  libraryEntrySchema,
  type LibraryEntryFormInput,
  type LibraryEntryFormValues,
} from '../model/schema'
import { useRemoveLibraryEntry, useSaveLibraryEntry } from '../model/queries'
import { READING_STATUSES, type LibraryEntry } from '../model/types'

interface LibraryEntryFormProps {
  book: { bookId: string; title: string; authorName?: string; coverUrl?: string }
  entry: LibraryEntry | null
}

export function LibraryEntryForm({ book, entry }: LibraryEntryFormProps) {
  const save = useSaveLibraryEntry()
  const remove = useRemoveLibraryEntry()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LibraryEntryFormInput, unknown, LibraryEntryFormValues>({
    resolver: zodResolver(libraryEntrySchema),
    defaultValues: {
      status: entry?.status ?? 'want',
      rating: entry?.rating ?? 0,
      notes: entry?.notes ?? '',
      finishedAt: entry?.finishedAt ?? '',
    },
  })

  const onSubmit = (values: LibraryEntryFormValues) =>
    save.mutate({
      ...book,
      status: values.status,
      rating: values.rating || undefined,
      notes: values.notes,
      finishedAt: values.finishedAt || undefined,
    })

  const describedBy = (name: keyof LibraryEntryFormInput) =>
    errors[name] ? `entry-${name}-error` : undefined

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{entry ? 'Моя бібліотека' : 'Додати до бібліотеки'}</h2>

      <Field label="Статус читання" htmlFor="entry-status" error={errors.status?.message}>
        <select id="entry-status" className="input" {...register('status')}>
          {Object.entries(READING_STATUSES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Моя оцінка" htmlFor="entry-rating" error={errors.rating?.message}>
        <select
          id="entry-rating"
          className="input"
          aria-invalid={Boolean(errors.rating)}
          aria-describedby={describedBy('rating')}
          {...register('rating')}
        >
          <option value={0}>Без оцінки</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {'★'.repeat(n)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Дата завершення" htmlFor="entry-finishedAt" error={errors.finishedAt?.message}>
        <input
          id="entry-finishedAt"
          type="date"
          className="input"
          aria-invalid={Boolean(errors.finishedAt)}
          aria-describedby={describedBy('finishedAt')}
          {...register('finishedAt')}
        />
      </Field>

      <Field label="Нотатки" htmlFor="entry-notes" error={errors.notes?.message}>
        <textarea
          id="entry-notes"
          rows={3}
          className="input"
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={describedBy('notes')}
          {...register('notes')}
        />
      </Field>

      {save.isError && (
        <ErrorState
          error={save.error}
          onRetry={() => save.variables && save.mutate(save.variables)}
          isRetrying={save.isPending}
        />
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" isLoading={save.isPending} disabled={Boolean(entry) && !isDirty}>
          {save.isPending ? 'Збереження…' : entry ? 'Зберегти зміни' : 'Додати'}
        </Button>
        {entry && (
          <Button
            type="button"
            variant="danger"
            isLoading={remove.isPending}
            onClick={() => remove.mutate(entry.bookId)}
          >
            Видалити з бібліотеки
          </Button>
        )}
      </div>
    </form>
  )
}
