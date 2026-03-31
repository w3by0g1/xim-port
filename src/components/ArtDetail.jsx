import { useEffect, useCallback, useState } from "react";
import "./ArtDetail.css";

function ArtDetail({ piece, pieces, currentIndex, onBack, onNavigate }) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < pieces.length - 1;
  const images = piece.images ?? (piece.image ? [piece.image] : []);
  const [imageIndex, setImageIndex] = useState(0);
  const [lastPieceId, setLastPieceId] = useState(piece.id);

  if (piece.id !== lastPieceId) {
    setLastPieceId(piece.id);
    setImageIndex(0);
  }

  const hasImageUp = imageIndex > 0;
  const hasImageDown = imageIndex < images.length - 1;

  const goImageUp = useCallback(() => {
    if (hasImageUp) setImageIndex((i) => i - 1);
  }, [hasImageUp]);

  const goImageDown = useCallback(() => {
    if (hasImageDown) setImageIndex((i) => i + 1);
  }, [hasImageDown]);

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
      if (e.key === "ArrowUp") goImageUp();
      if (e.key === "ArrowDown") goImageDown();
      if (e.key === "Escape" && onBack) onBack();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, goImageUp, goImageDown, onBack]);

  return (
    <div className="detail">
      <div className="detail-layout">
        <div className="detail-image-section">
          <div className="detail-image-wrapper">
            {images.length > 1 && (
              <button
                className="detail-image-nav detail-image-nav-up"
                onClick={goImageUp}
                disabled={!hasImageUp}
                aria-label="Previous image"
              >
                ↑
              </button>
            )}
            <img
              className="detail-image"
              src={images[imageIndex]}
              alt={piece.name}
              draggable={false}
            />
            {images.length > 1 && (
              <button
                className="detail-image-nav detail-image-nav-down"
                onClick={goImageDown}
                disabled={!hasImageDown}
                aria-label="Next image"
              >
                ↓
              </button>
            )}
          </div>
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
