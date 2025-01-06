import "../styles/Cart.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const apiUrl = import.meta.env.VITE_API_URL;

const Cart = () => {
  const [inputText, setInputText] = useState<string>("");
  const [lines, setLines] = useState<string[]>([]); // 줄 단위 저장 데이터

  // 서버에서 장바구니 데이터 조회하는 함수
  const getMyCart = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/my-fridge/shoppingcart`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      });
      // setInputText(response.data.join("\n")); // textarea에 표시할 텍스트로 변환
      setLines(response.data); // textarea에 표시할 텍스트로 변환
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
      Swal.fire({
        icon: "error",
        title: "조회 오류",
        text: "장바구니 조회 실패",
      });
    }
  };

  useEffect(() => {
    getMyCart();
  }, []);

  // 텍스트 입력 처리 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  // 줄 삭제 버튼 클릭
  const handleDeleteLine = (index: number) => {
    setLines((prevLines) => prevLines.filter((_, i) => i !== index));
  };

  // 줄 추가 처리
  const handleAddLine = () => {
    if (inputText.trim() !== "") {
      setLines((prevLines) => [...prevLines, inputText.trim()]);
      setInputText(""); // 입력 초기화
    }
  };

  // 저장 버튼 클릭 시 서버로 데이터 전송
  const handleSave = async () => {
    const memo = inputText.split("\n").filter((line) => line.trim() !== ""); // 리스트 생성
    console.log("inputText: ", inputText);
    console.log("memo: ", memo);
    try {
      const response = await axios.post(
        `${apiUrl}/api/my-fridge/shoppingcart`, // 백엔드 API 경로
        lines, // 리스트를 전송
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      console.log("response: ", response);
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "저장 성공",
          text: "장바구니 저장에 성공했습니다.",
        });
      }
    } catch (error) {
      console.error("장바구니 저장 실패:", error);
      Swal.fire({
        icon: "error",
        title: "저장 실패",
        text: "장바구니 저장 중 문제가 발생했습니다.",
      });
    }
  };

  return (
    <div className="cartbody">
      <div className="cart-container">
        <div className="cart-title">cart</div>
        <div className="cart-textbox">
          <div className="cart-fake-textarea">
            {lines.map((line, index) => (
              <div key={index} className="cart-line">
                <span className="bullet">●</span>
                <span className="line-text">{line}</span>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteLine(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* 입력창 */}
          <div className="cart-input-container">
            <textarea
              className="cart-input"
              value={inputText}
              placeholder="사야할 재료를 입력해주세요."
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e)}
            />
          </div>
        <button className="add-button" onClick={handleAddLine}>
          추가
        </button>
        <button className="save-cart-button" onClick={handleSave}>
          저장하기
        </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
