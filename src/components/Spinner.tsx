interface SpinnerProps {
  label?: string
  small?: boolean
}

export function Spinner({ label, small }: SpinnerProps) {
  return (
    <>
      <span
        className={small ? 'uiv-spinner small' : 'uiv-spinner'}
        role="status"
        aria-label={label ?? 'Loading'}
      />
      {label ? <span>{label}</span> : null}
    </>
  )
}
