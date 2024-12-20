import "../styles/Cart.css";
import { useState } from "react";

const Cart = () => {
  const [inputText, setInputText] = useState<string>("");

  // 엔터키로 텍스트를 태그로 추가하는 함수
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && inputText.trim() !== "") {
      const newTag = inputText.trim();
      setInputText(""); // 입력 후 텍스트 초기화

      // 입력된 텍스트를 태그 형식으로 변환
      const tagElement = document.createElement("span");
      tagElement.className = "tag"; // 태그 스타일 적용
      tagElement.textContent = newTag;

      e.preventDefault(); // 엔터키가 줄 바꿈을 하지 않도록 방지

      const contentEditable = e.target as HTMLDivElement;
      contentEditable.appendChild(tagElement); // contentEditable 안에 태그 추가
    }
  };

  // 텍스트 입력 처리 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    setInputText(e.target.innerText); // contenteditable 영역의 텍스트를 상태로 업데이트
  };

  return (
    <div className="cartbody">
      <div className="cart-container">
        <div className="cart-title">cart</div>
        <div className="cart-textbox">
          <textarea
            className="cart-text"
            contentEditable
            suppressContentEditableWarning
            placeholder="사야할 재료를 입력해주세요."
            onInput={handleInputChange}
            onKeyDown={handleKeyDown}
          >
            {inputText}
          </textarea>
        </div>
      </div>
    </div>
  );
};

export default Cart;
