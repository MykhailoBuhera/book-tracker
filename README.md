# 📚 Book Tracker

Лабораторна робота №12 (підсумковий проєкт курсу React). Тема №3 — **Book Tracker**.

SPA для пошуку книг в [Open Library](https://openlibrary.org/developers/api) та ведення власної бібліотеки:
статус читання, оцінка, дата завершення й нотатки.

**Deployed version:** https://mykhailobuhera.github.io/book-tracker/

## Можливості

- каталог книг: пошук, фільтр за жанром, сортування, пагінація — усе зберігається в query-параметрах URL;
- сторінка книги (`/books/:bookId`) з описом, темами та автором;
- сторінка автора (`/authors/:authorId`) з біографією та списком творів;
- «Моя бібліотека» (`/library?status=read&sort=rating`): фільтр за статусом, сортування, редагування та видалення;
- форма додавання/редагування книги в бібліотеці з Zod-валідацією (оцінка й дата — лише для прочитаних книг, дата не в майбутньому);
- стани loading / error (з кнопкою «Спробувати ще раз») / empty / success, pending під час мутацій, toast-повідомлення;
- темна тема зі збереженням вибору.

## Стек

React 19 · TypeScript · Vite · React Router · TanStack Query · Zustand · React Hook Form + Zod · Tailwind CSS · ESLint.

## Запуск

Потрібен Node.js 22.22+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # production build у dist/
```

Деплой на GitHub Pages виконує GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) при push у `main`.

## Архітектура

Обрано **feature-first**: код згруповано за предметними частинами, а не за технічним типом файлів.

```
src/
  app/             router (lazy routes), Layout, 404
  shared/
    api/           http.ts — єдине місце з fetch; open-library.ts — спільні хелпери API
    store/         Zustand: тема (persist), toast-повідомлення
    ui/            Button, Field, Pagination, Loader/ErrorState/EmptyState, Toaster
  features/
    books/         api/ (repository + DTO + mappers) · model/ (типи, query-хуки, URL-параметри) · ui/ · pages/
    authors/       api/ · model/ · pages/
    library/       api/ (repository) · model/ (типи, Zod-схема, query/mutation-хуки) · ui/ · pages/
```

**Напрямок залежностей:** `pages → ui / model (хуки) → api (repository) → shared/api/http`.
Компоненти ніколи не викликають `fetch` і не знають формат відповіді Open Library —
вони працюють із моделями `Book`, `BookDetails`, `Author`, `LibraryEntry`.
DTO (`SearchDocDto`, `WorkDto`, `AuthorDto`) та їх перетворення на моделі живуть лише в `*.repository.ts`.
Сторінки можуть комбінувати кілька фіч (наприклад, сторінка книги показує форму з `library`),
але data-access шари фіч один від одного не залежать.

### Repository

- `booksRepository` — пошук (`/search.json`) і деталі твору (`/works/:id.json`);
- `authorsRepository` — автор (`/authors/:id.json`) і його твори (`/authors/:id/works.json`);
- `libraryRepository` — CRUD власної бібліотеки. Open Library не підтримує запис, тому дані
  зберігаються в `localStorage`, але repository має асинхронний інтерфейс (зі штучною затримкою),
  тож UI працює з ним як із віддаленим backend, і сховище можна замінити на реальне API без змін у компонентах.

## Server state vs client state

| Стан | Де | Чому |
|------|----|------|
| Книги, автори, твори автора | TanStack Query | дані з зовнішнього API: кешування, повторні запити, `keepPreviousData` для пагінації |
| Бібліотека користувача | TanStack Query + `libraryRepository` | дані «backend-а»: query + mutations з інвалідацією кешу, optimistic видалення |
| Фільтри, сортування, сторінка | URL query-параметри | можна поділитися посиланням, працює кнопка «Назад» |
| Тема | Zustand + `persist` | client-owned налаштування, зберігається в localStorage |
| Toast-повідомлення | Zustand | тимчасовий UI-стан, потрібний з будь-якого місця (зокрема з mutation callbacks) |
| Значення форм | React Hook Form | локальний стан форми |

Один запис бібліотеки на сторінці книги береться з того ж кешу `['library']` через `select`, без дублювання стану.

## Додаткові можливості (розширення)

1. **Optimistic update** — видалення з бібліотеки зникає одразу й відкочується при помилці (`useRemoveLibraryEntry`).
2. **Lazy routes / code splitting** — кожна сторінка — окремий chunk (`route.lazy` у `app/router.tsx`).
3. **Dependent queries** — на сторінці книги автор завантажується лише після отримання `authorIds` книги.
4. **Темна тема з persistence** — Zustand `persist`.
