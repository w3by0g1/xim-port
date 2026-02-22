import { useEffect, useCallback } from "react";
import "./ArtDetail.css";

function ArtDetail({ piece, pieces, currentIndex, onBack, onNavigate }) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < pieces.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape" && onBack) onBack();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, onBack]);

  return (
    <div className="detail">
      <div className="detail-layout">
        <div className="detail-image-section">
          <img
            className="detail-image"
            src={piece.image}
            alt={piece.name}
            draggable={false}
          />
          <div className="detail-dots">
            {pieces.map((p, i) => (
              <button
                key={p.id}
                className={`detail-dot ${i === currentIndex ? "active" : ""}`}
                onClick={() => onNavigate(i)}
                aria-label={`Go to ${p.name}`}
              />
            ))}
          </div>
        </div>

        <div key={piece.id} className="detail-info">
          <button className="detail-back" onClick={onBack}>
            &larr; back
          </button>
          <h1 className="detail-title">{piece.name}</h1>
          <p className="detail-meta">
            ({piece.medium})
            <br />
            For {piece.client}
          </p>
          <p className="detail-description">{piece.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ArtDetail;
