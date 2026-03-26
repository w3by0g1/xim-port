import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useArtPieces } from "../hooks/useArtPieces";
import "../components/Gallery.css";
import "./WorksPage.css";
import selectIcon from "../assets/down arrow.svg";

function WorksPage() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const { artPieces, loading } = useArtPieces();
  const filtered = artPieces.filter((p) => p.category === category);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState(slug || null);
  const [transitioning, setTransitioning] = useState(!!slug);
  const [inlineSelected, setInlineSelected] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(null);
  const [pieceSlideDirection, setPieceSlideDirection] = useState(null);

  const detailScrollRef = useRef(null);
  const detailSwipeRef = useRef(null);
  const [detailScroll, setDetailScroll] = useState({
    top: false,
    bottom: false,
  });

  const selectedIndex = selectedSlug
    ? filtered.findIndex((p) => p.slug === selectedSlug)
    : -1;
  const selectedPiece = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  useEffect(() => {
    setDetailScroll({ top: false, bottom: true });
  }, [selectedSlug]);

  useEffect(() => {
    setImageIndex(0);
  }, [selectedSlug]);

  useEffect(() => {
    if (slug) {
      setSelectedSlug(slug);
      setTransitioning(false);
      const timer = setTimeout(() => setTransitioning(true), 20);
      return () => clearTimeout(timer);
    } else {
      setTransitioning(false);
      const timer = setTimeout(() => setSelectedSlug(null), 500);
      return () => clearTimeout(timer);
    }
  }, [slug]);

  useEffect(() => {
    if (!loading && filtered.length > 0 && !selectedSlug) {
      if (slug) {
        const index = filtered.findIndex((p) => p.slug === slug);
        if (index >= 0) {
          setSelectedSlug(slug);
          setActiveIndex(index);
          setImageIndex(0);
          setTransitioning(true);
        } else {
          navigate(`/works/${category}`, { replace: true });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, filtered]);

  // Reset activeIndex whenever category changes
  useEffect(() => {
    setActiveIndex(0);
    setSelectedSlug(null);
    setImageIndex(0);
    setTransitioning(false);
    setInlineSelected(false);
  }, [category]);

  useEffect(() => {
    if (selectedIndex >= 0) setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    const t = setTimeout(() => setPieceSlideDirection(null), 400);
    return () => clearTimeout(t);
  }, [slug]);

  const goNext = useCallback(() => {
    if (selectedSlug) {
      if (selectedIndex < filtered.length - 1) {
        const next = filtered[selectedIndex + 1];
        setPieceSlideDirection("left");
        navigate(`/works/${category}/${next.slug}`, { replace: true });
      }
    } else {
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    }
  }, [selectedSlug, selectedIndex, filtered, category, navigate]);

  const goPrev = useCallback(() => {
    if (selectedSlug) {
      if (selectedIndex > 0) {
        const prev = filtered[selectedIndex - 1];
        setPieceSlideDirection("right");
        navigate(`/works/${category}/${prev.slug}`, { replace: true });
      }
    } else {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  }, [selectedSlug, selectedIndex, filtered, category, navigate]);

  const handleBack = useCallback(() => {
    if (selectedSlug) navigate(`/works/${category}`);
    else navigate("/");
  }, [selectedSlug, category, navigate]);

  const goImagePrev = () => {
    setSlideDirection("right");
    setImageIndex((i) => i - 1);
  };

  const goImageNext = () => {
    setSlideDirection("left");
    setImageIndex((i) => i + 1);
  };

  // --- Gallery swipe ---
  const galleryTouchStartX = useRef(null);

  const handleGalleryTouchStart = useCallback((e) => {
    galleryTouchStartX.current = e.touches[0].clientX;
  }, []);

  const handleGalleryTouchEnd = useCallback(
    (e) => {
      if (galleryTouchStartX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - galleryTouchStartX.current;
      if (Math.abs(deltaX) < 40) return;
      if (deltaX < 0) goNext();
      if (deltaX > 0) goPrev();
      galleryTouchStartX.current = null;
    },
    [goNext, goPrev],
  );

  const galleryRef = useRef(null);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    el.addEventListener("touchstart", handleGalleryTouchStart, {
      passive: true,
    });
    el.addEventListener("touchend", handleGalleryTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleGalleryTouchStart);
      el.removeEventListener("touchend", handleGalleryTouchEnd);
    };
  }, [handleGalleryTouchStart, handleGalleryTouchEnd]);

  // --- Detail piece swipe ---
  const detailPieceSwipeX = useRef(null);
  const detailPieceSwipeY = useRef(null);

  const handleDetailSwipeStart = useCallback((e) => {
    detailPieceSwipeX.current = e.touches[0].clientX;
    detailPieceSwipeY.current = e.touches[0].clientY;
  }, []);

  const handleDetailSwipeEnd = useCallback(
    (e) => {
      if (detailPieceSwipeX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - detailPieceSwipeX.current;
      const deltaY = e.changedTouches[0].clientY - detailPieceSwipeY.current;
      if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX < 0) goNext();
      if (deltaX > 0) goPrev();
      detailPieceSwipeX.current = null;
      detailPieceSwipeY.current = null;
    },
    [goNext, goPrev],
  );

  useEffect(() => {
    const el = detailSwipeRef.current;
    if (!el) return;
    el.addEventListener("touchstart", handleDetailSwipeStart, {
      passive: true,
    });
    el.addEventListener("touchend", handleDetailSwipeEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleDetailSwipeStart);
      el.removeEventListener("touchend", handleDetailSwipeEnd);
    };
  }, [handleDetailSwipeStart, handleDetailSwipeEnd, selectedSlug]);

  // --- Keyboard ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") handleBack();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, handleBack]);

  // --- Guards ---
  if (loading) return <div className="works-page" />;

  if (filtered.length === 0) {
    return (
      <div className="works-page">
        <p style={{ color: "#999" }}>No pieces in this category.</p>
      </div>
    );
  }

  // --- Helpers ---
  const getImage = (piece, idx = 0) => {
    const imgs = piece.images || [piece.image];
    return imgs[idx] || imgs[0];
  };

  const handleDetailScroll = (e) => {
    const el = e.target;
    const atTop = el.scrollTop > 20;
    const atBottom = el.scrollTop < el.scrollHeight - el.clientHeight - 20;
    setDetailScroll({ top: atTop, bottom: atBottom });
  };

  // --- Main render ---
  return (
    <div className="works-page">
      <div
        className={`works-gallery ${transitioning ? "pushed-up" : ""} ${inlineSelected ? "pushed-right" : ""}`}
        ref={galleryRef}
      >
        <div className="gallery-coverflow">
          {[...filtered].reverse().map((piece, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;
            const absOffset = Math.abs(offset);
            const clampedOffset = Math.max(-3, Math.min(3, offset));
            return (
              <div
                key={piece.id}
                className={`gallery-item ${isActive ? "active" : ""}`}
                style={{
                  transform: isActive
                    ? "translateX(0) scale(1) rotateY(0deg)"
                    : `translateX(${clampedOffset * 220}px) scale(${1 - absOffset * 0.12}) rotateY(${clampedOffset * -35}deg)`,
                  zIndex: filtered.length - absOffset,
                  filter: isActive
                    ? "opacity(1)"
                    : `opacity(${Math.max(0, 1 - absOffset * 0.31)})`,
                  transition: "transform 0.5s ease, filter 0.5s ease",
                }}
                onClick={() => {
                  if (isActive) setInlineSelected((prev) => !prev);
                  else setActiveIndex(index);
                }}
              >
                <img
                  src={getImage(piece)}
                  alt={piece.name}
                  className="gallery-item-image"
                  draggable={false}
                />
                {!isActive && (
                  <div
                    className="gallery-item-frost"
                    style={{
                      opacity: Math.min(absOffset * 0.3, 0.7),
                    }}
                  />
                )}
                {isActive && !selectedSlug && !inlineSelected && (
                  <div key={piece.id} className="gallery-info">
                    <span className="gallery-name">{piece.name}</span>
                    {piece.client != null && (
                      <span className="gallery-client">
                        &nbsp;FOR {piece.client}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {(() => {
        const reversedFiltered = [...filtered].reverse();
        const activePiece = reversedFiltered[activeIndex];
        if (!activePiece) return null;
        return (
          <div
            className={`works-inline-info ${inlineSelected ? "visible" : ""}`}
          >
            <button
              className="works-inline-info-back"
              onClick={() => setInlineSelected(false)}
            >
              &larr; back
            </button>
            <h1 className="works-inline-info-title">{activePiece.name}</h1>
            {activePiece.client != null ? (
              <p className="works-inline-info-meta">
                {activePiece.medium}, for {activePiece.client}
              </p>
            ) : (
              <p className="works-inline-info-meta">{activePiece.medium}</p>
            )}
            <p className="works-inline-info-description">
              {activePiece.description}
            </p>
          </div>
        );
      })()}

      {selectedSlug &&
        selectedPiece &&
        (() => {
          const images = Array.isArray(selectedPiece.images)
            ? selectedPiece.images
            : selectedPiece.image
              ? [selectedPiece.image]
              : [];
          const hasMultiple = images.length > 1;
          const canImgPrev = imageIndex > 0;
          const canImgNext = imageIndex < images.length - 1;

          return (
            <div
              className={`works-detail ${transitioning ? "visible" : ""}`}
              ref={(el) => {
                detailScrollRef.current = el;
                detailSwipeRef.current = el;
              }}
              onScroll={handleDetailScroll}
            >
              <div
                className={`detail-fade-top ${detailScroll.top ? "visible" : ""}`}
              />

              <div
                className={`works-detail-content ${
                  pieceSlideDirection
                    ? `piece-slide-${pieceSlideDirection}`
                    : ""
                }`}
              >
                <div className="works-detail-image-section">
                  <div className="works-detail-image-wrapper">
                    <div
                      key={imageIndex}
                      className="works-detail-image-slide slide-in"
                    >
                      <img
                        className="works-detail-image"
                        style={{ height: "80vh" }}
                        src={images[imageIndex]}
                        alt={selectedPiece.name}
                        draggable={false}
                      />
                    </div>

                    {hasMultiple && (
                      <>
                        <div
                          className="image-nav image-nav-prev"
                          onClick={goImagePrev}
                          style={{
                            opacity: canImgPrev ? 1 : 0,
                            pointerEvents: canImgPrev ? "auto" : "none",
                          }}
                          aria-label="Previous image"
                        >
                          ←
                        </div>
                        <div
                          className="image-nav image-nav-next"
                          onClick={goImageNext}
                          style={{
                            opacity: canImgNext ? 1 : 0,
                            pointerEvents: canImgNext ? "auto" : "none",
                          }}
                          aria-label="Next image"
                        >
                          →
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="works-detail-text">
                  <div key={selectedPiece.id} className="works-detail-info">
                    <button className="works-detail-back" onClick={handleBack}>
                      &larr; back
                    </button>
                    <h1 className="works-detail-title">{selectedPiece.name}</h1>
                    {selectedPiece.client != null && (
                      <p className="works-detail-meta">
                        ({selectedPiece.medium})<br />
                        For {selectedPiece.client}
                      </p>
                    )}
                  </div>

                  <p className="works-detail-description">
                    {selectedPiece.description}
                  </p>
                </div>
              </div>

              {window.innerWidth > 768 && (
                <>
                  <button
                    className="works-detail-nav works-detail-nav-prev"
                    onClick={goPrev}
                    disabled={selectedIndex === 0}
                  >
                    &larr;
                    <span>previous</span>
                  </button>
                  <button
                    className="works-detail-nav works-detail-nav-next"
                    onClick={goNext}
                    disabled={selectedIndex === filtered.length - 1}
                  >
                    <span>next</span>
                    &rarr;
                  </button>
                </>
              )}
            </div>
          );
        })()}

      {selectedSlug && window.innerWidth < 768 && (
        <>
          <div className="top-gradient" />
          <div
            className={`works-page-back-icon ${transitioning ? "icon-visible" : ""}`}
            onClick={() => navigate(`/works/${category}`)}
          >
            <img src={selectIcon} alt="select" />
          </div>
        </>
      )}
    </div>
  );
}

export default WorksPage;
