import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import _ from "lodash";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toTopRef = useRef<HTMLDivElement>(null); // 버튼을 참조하는 useRef

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
    const throttledScroll = _.throttle(() => {
      handleScroll();

      if (window.scrollY > 800) {
        // 버튼 보이기 애니메이션
        gsap.to(toTopRef.current, { x: 0, duration: 0.5 });
      } else {
        // 버튼 숨기기 애니메이션
        gsap.to(toTopRef.current, { x: 100, duration: 0.5 });
      }
    }, 300);

    window.addEventListener("scroll", throttledScroll);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, []);

  return (
    <div
      id="to-top"
      ref={toTopRef}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "50px",
        height: "50px",
        backgroundColor: "#333",
        border: "2px solid #fff",
        color: "#fff",
        display: isVisible ? "flex" : "none", // 버튼의 기본 표시 여부
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        cursor: "pointer",
        transform: "translateX(100px)", // 초기 위치 (숨겨진 상태)
      }}
      onClick={scrollToTop}
    >
      ↑
    </div>
  );
};

export default ScrollToTopButton;
