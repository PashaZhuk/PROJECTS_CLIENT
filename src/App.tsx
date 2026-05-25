import logo from './assets/logo.webp'

const PageLoader = () => (
  <div className="loader-wrapper">
    <div className="loader-container">

      {/* Графическая часть (всё выровнено по центру через Grid) */}
      <div className="loader-media">
        <div className="loader-glow" />
        <div className="loader-orbit orbit-1" />
        <div className="loader-orbit orbit-2" />
        <div className="loader-backdrop" />
        <img src={logo} alt="Loading..." className="loader-logo" />
      </div>

      {/* Текст вынесен отдельно снизу */}
      <div className="loader-text">
        ЗАГРУЗКА<span>.</span><span>.</span><span>.</span>
      </div>

    </div>
  </div>
)
