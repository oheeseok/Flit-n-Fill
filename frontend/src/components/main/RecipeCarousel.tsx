import React, { useState } from "react";
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

  const nextSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex + 1 + todayrecipeimages.length) % todayrecipeimages.length
    );
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + todayrecipeimages.length) % todayrecipeimages.length
    );
  };

  const prevIndex =
    (currentIndex - 1 + todayrecipeimages.length) % todayrecipeimages.length;
  const nextIndex =
    (currentIndex + 1 + todayrecipeimages.length) % todayrecipeimages.length;

  return (
    <div className="carousel-container">
      <div className="carousel-title">Today's Recipes</div>

      <div className="carousel-images">
        <img
          src={todayrecipeimages[prevIndex].img}
          alt={todayrecipeimages[prevIndex].name}
        />
        <img
          src={todayrecipeimages[currentIndex].img}
          alt={todayrecipeimages[currentIndex].name}
        />
        <img
          src={todayrecipeimages[nextIndex].img}
          alt={todayrecipeimages[nextIndex].name}
        />
      </div>

      <div className="carousel-buttons">
        <button onClick={prevSlide} className="btn">
          이전
        </button>
        <button onClick={nextSlide} className="btn">
          다음
        </button>
      </div>

      <div className="todayrecipedot">
        <h1>.....</h1>
      </div>
    </div>
  );
};

export default RecipeCarousel;
