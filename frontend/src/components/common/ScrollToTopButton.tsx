import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 800) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            width: "42px",
            height: "42px",
            backgroundColor: "#333",
            color: "#fff",
            border: "2px solid #fff",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 9,
            fontWeight: "bold",
          }}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
