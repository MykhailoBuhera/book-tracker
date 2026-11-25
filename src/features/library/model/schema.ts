import { z } from 'zod'
import type { ReadingStatus } from './types'

const statuses = ['want', 'reading', 'read'] as const satisfies readonly ReadingStatus[]

const today = () => new Date().toISOString().slice(0, 10)

export const libraryEntrySchema = z
  .object({
    status: z.enum(statuses),
    rating: z.coerce.number().int().min(0).max(5), // 0 = no rating
    notes: z.string().trim().max(500, 'Нотатка — не більше 500 символів'),
    finishedAt: z.string(), // '' or yyyy-mm-dd
  })
  .superRefine((value, ctx) => {
    if (value.rating > 0 && value.status !== 'read') {
      ctx.addIssue({ code: 'custom', path: ['rating'], message: 'Оцінити можна лише прочитану книгу' })
    }
    if (value.finishedAt && value.status !== 'read') {
      ctx.addIssue({ code: 'custom', path: ['finishedAt'], message: 'Дата завершення — лише для прочитаних книг' })
    }
    if (value.finishedAt && value.finishedAt > today()) {
      ctx.addIssue({ code: 'custom', path: ['finishedAt'], message: 'Дата не може бути в майбутньому' })
    }
  })

export type LibraryEntryFormInput = z.input<typeof libraryEntrySchema>
export type LibraryEntryFormValues = z.output<typeof libraryEntrySchema>
