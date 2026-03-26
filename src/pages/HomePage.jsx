import { useState, useEffect, useCallback, useRef } from "react";
import { useArtPieces } from "../hooks/useArtPieces";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function pickRandom(length, exclude = null) {
  let next;
  do {
    next = Math.floor(Math.random() * length);
  } while (next === exclude && length > 1);
  return next;
}

function HomePage() {
  const { artPieces, loading } = useArtPieces();
  const navigate = useNavigate();
  const [isFading, setIsFading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [contentVisible, setContentVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!loading && artPieces.length > 0 && currentIndex === null) {
      const id = requestAnimationFrame(() => {
        setCurrentIndex(pickRandom(artPieces.length));
      });
      return () => cancelAnimationFrame(id);
    }
  }, [loading, artPieces.length, currentIndex]);

  const cycleToNext = useCallback(() => {
    if (artPieces.length <= 1) return;
    setContentVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => pickRandom(artPieces.length, prev));
      setContentVisible(true);
    }, 500);
  }, [artPieces.length]);

  useEffect(() => {
    if (loading || currentIndex === null) return;
    timerRef.current = setInterval(cycleToNext, 10000);
    return () => clearInterval(timerRef.current);
  }, [loading, currentIndex, cycleToNext]);

  const currentPiece = currentIndex !== null ? artPieces[currentIndex] : null;

  const handleClick = () => {
    if (!currentPiece) return;
    clearInterval(timerRef.current);
    setIsFading(true);
    setTimeout(() => {
      navigate(`/works/${currentPiece.category}/${currentPiece.slug}`);
    }, 400);
  };

  if (loading || !currentPiece) return <main className="hero" />;

  return (
    <main className={`hero ${isFading ? "fade-out" : ""}`}>
      <div
        className={`hero-content ${contentVisible ? "hero-visible" : "hero-hidden"}`}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <img
          className="hero-image"
          src={currentPiece.images?.[0]}
          alt={currentPiece.name}
        />
        <div className="hero-info">
          <span className="hero-name">{currentPiece.name}</span>
          <span className="hero-client">
            &nbsp;&nbsp;&nbsp;FOR {currentPiece.client}
          </span>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
