/* Native picture/img keeps the supplied mobile and desktop crops with art direction. */
const stats = [
  { value: "10k+", label: "Companies" },
  { value: "314", label: "Templates" },
  { value: "12M+", label: "Queries" },
];

export default function Home() {
  return (
    <>
      <main>
        <article className="stats-card" aria-labelledby="card-title">
          <picture className="stats-image">
            <source media="(min-width: 40rem)" srcSet="/images/image-header-desktop.jpg" width={540} height={446} />
            <img src="/images/image-header-mobile.jpg" width={654} height={480} alt="Three colleagues working on laptops around a shared office table." fetchPriority="high" />
          </picture>
          <div className="stats-copy">
            <div className="text-content">
              <h1 id="card-title">Get <span className="accent">insights</span> that help your business grow.</h1>
              <p className="description">Discover the benefits of data analytics and make better decisions regarding revenue, customer experience, and overall efficiency.</p>
            </div>
            <dl className="stats">
              {stats.map(stat => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </article>
      </main>
      <footer><span className="site-name">Stats preview card</span>. Challenge by <a href="https://www.frontendmentor.io/challenges/stats-preview-card-component-8JqbgoU62">Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.</footer>
    </>
  );
}
