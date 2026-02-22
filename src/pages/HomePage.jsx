import { useState, useMemo } from "react";
import { useArtPieces } from "../hooks/useArtPieces";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const { artPieces, loading } = useArtPieces();
  const navigate = useNavigate();
  const [isFading, setIsFading] = useState(false);

  const randomPiece = useMemo(
    () =>
      artPieces.length > 0
        ? artPieces[Math.floor(Math.random() * artPieces.length)]
        : null,
    [artPieces],
  );

  const handleClick = () => {
    if (!randomPiece) return;
    setIsFading(true);
    setTimeout(() => {
      navigate(`/works/${randomPiece.category}/${randomPiece.slug}`);
    }, 400);
  };

  if (loading || !randomPiece) return <main className="hero" />;

  return (
    <main className={`hero ${isFading ? "fade-out" : ""}`}>
      <div
        className="hero-content"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <img
          className="hero-image"
          src={randomPiece.images?.[0]}
          alt={randomPiece.name}
        />
        <div className="hero-info">
          <span className="hero-name">{randomPiece.name}</span>
          <span className="hero-client">
            &nbsp;&nbsp;&nbsp;FOR {randomPiece.client}
          </span>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
