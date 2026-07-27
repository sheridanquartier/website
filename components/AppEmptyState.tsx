interface AppEmptyStateProps {
  title: string
  description: string
  primaryLabel?: string
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export default function AppEmptyState({
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: AppEmptyStateProps) {
  return (
    <div className="rounded-[22px] border border-[var(--app-ios-line)] bg-white px-5 py-10 text-center shadow-[0_1px_2px_rgba(15,23,20,0.04)] md:px-8 md:py-12">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--app-ios-accent-soft)]">
        <div className="h-5 w-5 rounded-full border border-[rgba(23,107,82,0.22)] bg-white" />
      </div>
      <h3 className="mb-2 text-[24px] md:text-[28px]">{title}</h3>
      <p className="mx-auto mb-0 max-w-[34rem] text-[15px] leading-[1.7] text-[var(--muted)] md:text-[16px]">
        {description}
      </p>
      {(primaryLabel || secondaryLabel) && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {secondaryLabel && onSecondary && (
            <button onClick={onSecondary} className="btn-secondary">
              {secondaryLabel}
            </button>
          )}
          {primaryLabel && onPrimary && (
            <button onClick={onPrimary} className="btn-primary">
              {primaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
