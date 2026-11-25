interface BookCoverProps {
  src?: string
  title: string
  className?: string
}

export function BookCover({ src, title, className = '' }: BookCoverProps) {
  if (!src) {
    return (
      <div
        className={`flex aspect-[2/3] items-center justify-center rounded-lg bg-slate-200 p-2 text-center text-xs text-slate-500 dark:bg-slate-700 ${className}`}
      >
        Без обкладинки
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={`Обкладинка: ${title}`}
      loading="lazy"
      className={`aspect-[2/3] rounded-lg object-cover ${className}`}
    />
  )
}
