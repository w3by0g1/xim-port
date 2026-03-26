import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [view, setView] = useState("main");
  const timerRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const isMobile = () =>
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (delay = 2000) => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        setView("main");
      }, delay);
    },
    [clearTimer],
  );

  // Mobile: close on outside tap or after 5s
  useEffect(() => {
    if (!isMobile() || view !== "works") return;

    startTimer(5000);

    const handleOutsideTap = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        clearTimer();
        setView("main");
      }
    };

    document.addEventListener("touchstart", handleOutsideTap);
    return () => {
      document.removeEventListener("touchstart", handleOutsideTap);
      clearTimer();
    };
  }, [view, startTimer, clearTimer]);

  const handleMouseEnter = () => {
    if (isMobile()) return;
    clearTimer();
  };

  const handleMouseLeave = () => {
    if (isMobile()) return;
    if (view === "works") startTimer(2000);
  };

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    clearTimer();
    setView("main");
    navigate(`/works/${category}`);
  };

  return (
    <header
      className="header"
      ref={headerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav
        className={`header-nav ${view === "works" ? "slide-out" : "slide-in"}`}
      >
        <a
          href="#works"
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            navigate("/works");
          }}
        >
          work
        </a>
        <a href="#about" className="nav-link">
          about
        </a>
        <a className="nav-link" href="mailto:ximilustra@gmail.com">
          contact
        </a>
      </nav>
      <nav
        className={`header-nav works-nav ${view === "works" ? "slide-in" : "slide-out"}`}
      >
        <a
          href="/works/narrative"
          className="nav-link"
          onClick={(e) => handleCategoryClick(e, "narrative")}
        >
          Narrative
        </a>

        <a
          href="/works/editorial"
          className="nav-link"
          onClick={(e) => handleCategoryClick(e, "editorial")}
        >
          Editorial
        </a>

        <a
          href="/works/personal"
          className="nav-link"
          onClick={(e) => handleCategoryClick(e, "personal")}
        >
          Personal
        </a>
      </nav>
    </header>
  );
}

export default Header;
