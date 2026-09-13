export default function PageHero({ label, title, description, children }) {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="container">
        <div className="page-hero-content">
          <span className="section-label">{label}</span>
          <h1 id="page-title" className="page-hero-title">{title}</h1>
          {description && <p className="page-hero-desc">{description}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}