import { useNavigate } from "react-router-dom";
import { useRef, useState, useCallback, useEffect } from "react";
import { useArtPieces } from "../hooks/useArtPieces";
import "./WorksOverviewPage.css";

const CATEGORIES = ["narrative", "editorial", "personal"];
const REPEATS = 100;

const AUTO_SPEED = 0.5; // px per frame

function InfiniteColumn({ cat, pieces, navigate, getImage, startOffset = 0 }) {
  const scrollRef = useRef(null);
  const resetLock = useRef(false);
  const rafRef = useRef(null);
  const accumRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  const wrapScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || resetLock.current || pieces.length === 0) return;

    const oneSetHeight = el.scrollHeight / REPEATS;

    if (el.scrollTop >= oneSetHeight * (REPEATS - 1)) {
      resetLock.current = true;
      el.scrollTop -= oneSetHeight;
      resetLock.current = false;
    } else if (el.scrollTop <= 0) {
      resetLock.current = true;
      el.scrollTop += oneSetHeight;
      resetLock.current = false;
    }
  }, [pieces.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || pieces.length === 0) return;
    const oneSetHeight = el.scrollHeight / REPEATS;
    el.scrollTop = oneSetHeight * Math.floor(REPEATS / 2) + el.clientHeight * startOffset;
  }, [pieces.length, startOffset]);

  useEffect(() => {
    if (hovered || pieces.length === 0) return;

    let lastTime = performance.now();
    accumRef.current = 0;

    const tick = (now) => {
      const delta = now - lastTime;
      lastTime = now;
      accumRef.current += (AUTO_SPEED * delta) / 16.67; // normalize to ~60fps

      if (accumRef.current >= 1) {
        const px = Math.floor(accumRef.current);
        accumRef.current -= px;
        const el = scrollRef.current;
        if (el) {
          el.scrollTop += px;
          wrapScroll();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hovered, pieces.length, wrapScroll]);

  const repeated = Array.from({ length: REPEATS }, () => pieces).flat();

  return (
    <div
      className="works-overview-column"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="works-overview-heading" data-text={cat} onClick={() => navigate(`/works/${cat}`)}>{cat}</h2>
      <div
        className="works-overview-scroll"
        ref={scrollRef}
        onScroll={wrapScroll}
      >
        {repeated.map((piece, i) => (
          <div
            key={`${piece.id}-${i}`}
            className="works-overview-card"
            onClick={() => navigate(`/works/${cat}/${piece.slug}`)}
          >
            <img
              src={getImage(piece)}
              alt={piece.name}
              className="works-overview-image"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function WorksOverviewPage() {
  const { artPieces, loading } = useArtPieces();
  const navigate = useNavigate();

  if (loading) return <div className="works-overview" />;

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = artPieces.filter((p) => p.category === cat);
    return acc;
  }, {});

  const getImage = (piece) => {
    const imgs = piece.images || [piece.image];
    return imgs[0];
  };

  return (
    <div className="works-overview">
      {CATEGORIES.map((cat) => (
        <InfiniteColumn
          key={cat}
          cat={cat}
          pieces={grouped[cat]}
          navigate={navigate}
          getImage={getImage}
          startOffset={cat === "editorial" ? 0.5 : 0}
        />
      ))}
    </div>
  );
}

export default WorksOverviewPage;
