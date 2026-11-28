export function ComingSoon({ title, uc }: { title: string; uc: string }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      <p className="muted">
        This screen implements <strong>{uc}</strong> and has not been built yet.
      </p>
    </section>
  )
}
