"use client"
import "./SkeletonLoader.css"

const SkeletonLoader = ({ type = "default" }) => {
  if (type === "card") {
    return (
      <div className="skeleton-card">
        <div className="skeleton-header">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-text-group">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-subtitle"></div>
          </div>
        </div>
        <div className="skeleton-content">
          <div className="skeleton-text skeleton-line"></div>
          <div className="skeleton-text skeleton-line"></div>
          <div className="skeleton-text skeleton-line short"></div>
        </div>
      </div>
    )
  }

  if (type === "list") {
    return (
      <div className="skeleton-list">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="skeleton-list-item">
            <div className="skeleton-avatar small"></div>
            <div className="skeleton-text-group">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-subtitle"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-text skeleton-title large"></div>
        <div className="skeleton-text skeleton-subtitle"></div>
      </div>
      <div className="skeleton-grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-line"></div>
              <div className="skeleton-text skeleton-line short"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonLoader




