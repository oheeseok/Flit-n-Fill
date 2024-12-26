import React, { useState } from "react";
import FridgeSearchBar from "../../components/fridge/FridgeSearchBar";
import "../../styles/fridge/FridgeRegister.css";
import axios from "axios";

const FridgeRegister = () => {
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState<string>("N"); // 기본 단위는 "개"
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [manufactureDate, setManufactureDate] = useState<string>("");
  const [storageMethod, setStorageMethod] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  const handleRegister = async () => {
    try {
      const requestBody = {
        foodListId: 6, // 임의의 ID, 필요 시 변경
        foodCategory: "INGREDIENT",
        foodCount: quantity,
        foodUnit: unit, // 선택된 단위 전달
        foodProDate: manufactureDate,
        foodExpDate: expirationDate,
        foodStorage:
          storageMethod === "냉장"
            ? "REFRIGERATED"
            : storageMethod === "냉동"
            ? "FROZEN"
            : "ROOM_TEMP",
        foodDescription: remarks,
      };

      const response = await axios.post(
        "http://localhost:8080/api/food",
        requestBody
      );

      if (response.status === 200 || response.status === 201) {
        alert("재료가 성공적으로 등록되었습니다.");
        // 폼 초기화
        setName("");
        setQuantity("");
        setUnit("N");
        setExpirationDate("");
        setManufactureDate("");
        setStorageMethod("");
        setRemarks("");
      } else {
        alert("재료 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error registering food:", error);
      alert("재료 등록 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    // 취소 로직 (초기화)
    setName("");
    setQuantity("");
    setUnit("N");
    setExpirationDate("");
    setManufactureDate("");
    setStorageMethod("");
    setRemarks("");
  };

  return (
    <div className="fridgeregisterbody">
      <FridgeSearchBar />

      <div className="fridgeregister-container">
        <div className="category-selection">
          <div className="category-group">
            <h3>대분류</h3>
            <ul>
              <li>과일류</li>
              <li>식량작물</li>
              <li>특용작물</li>
              <li>채소류</li>
              <li>축산물</li>
              <li>수산물</li>
            </ul>
          </div>
          <div className="category-group">
            <h3>중분류</h3>
            <ul>
              <li>사과</li>
              <li>배</li>
              <li>복숭아</li>
              <li>포도</li>
              <li>감귤</li>
              <li>바나나</li>
              <li>체리</li>
              <li>망고</li>
              <li>아보카도</li>
            </ul>
          </div>
          <div className="category-group">
            <h3>소분류</h3>
            <ul>
              <li>...</li>
            </ul>
          </div>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              placeholder="선택된 재료 이름 자동 등록"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>수량</label>
            <div className="quantity-input">
              <input
                type="number"
                placeholder="수량 입력"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || "")}
              />
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="N">개</option>
                <option value="L">L</option>
                <option value="G">g</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>소비기한</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>제조일자</label>
            <input
              type="date"
              value={manufactureDate}
              onChange={(e) => setManufactureDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>보관 방법</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="storage"
                  value="냉장"
                  checked={storageMethod === "냉장"}
                  onChange={(e) => setStorageMethod(e.target.value)}
                />{" "}
                냉장
              </label>
              <label>
                <input
                  type="radio"
                  name="storage"
                  value="냉동"
                  checked={storageMethod === "냉동"}
                  onChange={(e) => setStorageMethod(e.target.value)}
                />{" "}
                냉동
              </label>
              <label>
                <input
                  type="radio"
                  name="storage"
                  value="실온"
                  checked={storageMethod === "실온"}
                  onChange={(e) => setStorageMethod(e.target.value)}
                />{" "}
                실온
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>비고</label>
            <textarea
              placeholder="비고"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>

          <div className="form-buttons">
            <button className="register-button" onClick={handleRegister}>
              등록하기
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              취소하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FridgeRegister;
