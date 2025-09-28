import "./AboutUs.css"

const AboutUs = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1 className="main-title">About Us</h1>
        <p className="subtitle">Transforming Agriculture Through Innovation</p>
      </header>

      <section className="intro-section">
        <p className="intro-text">
          Welcome to the Climate-Smart Agriculture Platform, where cutting-edge technology meets sustainable farming. We
          empower farmers worldwide with data-driven insights and advanced tools to navigate the challenges of modern
          agriculture while protecting our planet's future.
        </p>
      </section>

      <section className="mission-vision-section">
        <div className="card mission-card">
          <div className="card-icon">🎯</div>
          <h2>Our Mission</h2>
          <p>
            To revolutionize agriculture by providing farmers with intelligent, data-driven solutions that enhance
            productivity, minimize environmental impact, and build resilience against climate change challenges.
          </p>
        </div>
        <div className="card vision-card">
          <div className="card-icon">🌱</div>
          <h2>Our Vision</h2>
          <p>
            A world where sustainable agriculture thrives through technology, ensuring food security for all while
            preserving our environment for future generations. Every farmer equipped with the knowledge and tools to
            succeed in an evolving climate.
          </p>
        </div>
      </section>

      <section className="goals-section">
        <h2 className="section-title">Strategic Goals</h2>
        <div className="goals-grid">
          <div className="goal-item">
            <div className="goal-number">01</div>
            <h3>Data-Driven Insights</h3>
            <p>Provide actionable climate and crop intelligence to optimize farming decisions</p>
          </div>
          <div className="goal-item">
            <div className="goal-number">02</div>
            <h3>Sustainable Practices</h3>
            <p>Promote eco-friendly farming methods that protect our environment</p>
          </div>
          <div className="goal-item">
            <div className="goal-number">03</div>
            <h3>Predictive Analytics</h3>
            <p>Enable better decision-making through advanced crop yield modeling</p>
          </div>
          <div className="goal-item">
            <div className="goal-number">04</div>
            <h3>Collaborative Network</h3>
            <p>Foster partnerships between farmers, researchers, and policymakers</p>
          </div>
        </div>
      </section>

      <section className="achievements-section">
        <h2 className="section-title">Our Impact</h2>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-number">1,000+</div>
            <h3>Farmers Empowered</h3>
            <p>Successfully implemented crop prediction models across diverse agricultural communities</p>
          </div>
          <div className="achievement-card">
            <div className="achievement-number">20%</div>
            <h3>Cost Reduction</h3>
            <p>Average farming cost reduction achieved through precision agriculture tools</p>
          </div>
          <div className="achievement-card">
            <div className="achievement-number">500+</div>
            <h3>Smallholder Farmers</h3>
            <p>Supported with advanced agricultural technology and sustainable practices</p>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Climate-Smart Agriculture Platform. All rights reserved.</p>
          <p className="footer-tagline">Building a sustainable future, one farm at a time.</p>
        </div>
      </footer>
    </div>
  )
}

export default AboutUs
