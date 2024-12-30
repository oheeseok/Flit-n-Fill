import "../styles/Cart.css";
import { useState } from "react";

const Cart = () => {
  const [inputText, setInputText] = useState<string>("");

  // 엔터키로 텍스트를 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && inputText.trim() !== "") {
      e.preventDefault(); // 줄바꿈 방지
      const newTag = inputText.trim();
      console.log("새 태그:", newTag);
      setInputText(""); // 입력 초기화
    }
  };

  return (
    <div className="cartbody">
      <div className="cart-container">
        <div className="cart-title">cart</div>
        <textarea
          className="cart-text"
          value={inputText}
          placeholder="사야할 재료를 입력해주세요."
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default Cart;
