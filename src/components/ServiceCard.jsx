export default function ServiceCard({ icon: Icon, number, title, description, featured = false }) {
  return (
    <article className={`service-card ${featured ? 'featured' : ''}`}>
      {/* Number and icon are separate flex children so they can never collide.
          The head wrapper is always rendered to keep icon spacing identical on
          pages that pass no number. */}
      <div className="service-card-head">
        {number && <span className="badge-number">{number}</span>}
        <div className="service-icon" aria-hidden="true">
          <Icon size={28} strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-desc">{description}</p>
    </article>
  )
}