import React, { useState, useEffect } from "react";
import steak from "../../assets/images/steak.jpg";
import pizza from "../../assets/images/pizza.png";
import pasta from "../../assets/images/pasta.png";
import eggdrop from "../../assets/images/eggdrop.jpg";
import eggcake from "../../assets/images/eggcake.jpg";
import "../../styles/main/RecipeCarousel.css";

interface RecipeImages {
  id: number;
  name: string;
  img: string;
}

const todayrecipeimages: RecipeImages[] = [
  { id: 0, name: "RecipeCarousel01", img: steak },
  { id: 1, name: "RecipeCarousel02", img: pizza },
  { id: 2, name: "RecipeCarousel03", img: pasta },
  { id: 3, name: "RecipeCarousel04", img: eggdrop },
  { id: 4, name: "RecipeCarousel05", img: eggcake },
];

// 캐러셀 컴포넌트
const RecipeCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + 1 + todayrecipeimages.length) % todayrecipeimages.length
      );
    }, 5000); // 3초마다 자동 슬라이드

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + todayrecipeimages.length) % todayrecipeimages.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex + 1 + todayrecipeimages.length) % todayrecipeimages.length
    );
  };

  return (
    <div className="carousel-container">
      <div className="carousel-title">Today's Recipes</div>

      <div className="carousel-images">
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <img
            src={
              todayrecipeimages[
                (currentIndex - 1 + todayrecipeimages.length) %
                  todayrecipeimages.length
              ].img
            }
            alt={
              todayrecipeimages[
                (currentIndex - 1 + todayrecipeimages.length) %
                  todayrecipeimages.length
              ].name
            }
            className="carousel-image-prev"
          />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img
            src={todayrecipeimages[currentIndex].img}
            alt={todayrecipeimages[currentIndex].name}
            className="carousel-image-current"
          />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <img
            src={
              todayrecipeimages[(currentIndex + 1) % todayrecipeimages.length]
                .img
            }
            alt={
              todayrecipeimages[(currentIndex + 1) % todayrecipeimages.length]
                .name
            }
            className="carousel-image-next"
          />
        </div>
      </div>

      <div className="carousel-navigation">
        <button className="carousel-button" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="carousel-button" onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      {/* <div className="carousel-dots">
        {todayrecipeimages.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div> */}
    </div>
  );
};

export default RecipeCarousel;
