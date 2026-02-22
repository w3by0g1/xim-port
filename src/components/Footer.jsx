import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
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
    <a className="footer" onClick={() => navigate("/")}>
      <span>XIM ILUSTRA</span>
    </a>
  );
}

export default Footer;
