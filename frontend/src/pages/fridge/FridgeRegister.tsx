import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../styles/fridge/FridgeRegister.css";
import { CATEGORY_DATA } from "../../data/categoryData";
import { useFridge } from "../../context/FridgeContext";

const FridgeRegister = () => {
  const { addFridgeItem } = useFridge();
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedDetailCategory, setSelectedDetailCategory] =
    useState<string>("");
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState<string>("개");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [manufactureDate, setManufactureDate] = useState<string>("");
  const [storageMethod, setStorageMethod] = useState<"냉장" | "냉동" | "실온">(
    "냉장"
  );
  const [remarks, setRemarks] = useState<string>("");
  const [adminRequest, setAdminRequest] = useState<string>("");

  // 아이콘 경로 상태
  const [icon, setIcon] = useState<string>("");

  useEffect(() => {
    // 이름 및 아이콘 업데이트
    if (selectedDetailCategory) {
      setName(selectedDetailCategory);
      setIcon(
        CATEGORY_DATA[selectedMainCategory]?.중분류?.[selectedSubCategory]
          ?.소분류?.[selectedDetailCategory] || ""
      );
    } else if (selectedSubCategory) {
      setName(selectedSubCategory);
      setIcon(
        CATEGORY_DATA[selectedMainCategory]?.중분류?.[selectedSubCategory]
          ?.icon || ""
      );
    } else {
      setName("");
      setIcon("");
    }
  }, [selectedMainCategory, selectedSubCategory, selectedDetailCategory]);

  const handleRegister = (): void => {
    if (!selectedMainCategory || !selectedSubCategory) {
      Swal.fire({
        icon: "error",
        title: "입력 오류",
        text: "대분류와 중분류를 선택해주세요.",
      });
      return;
    }

    const newItem = {
      id: Date.now(), // 고유 ID 생성
      mainCategory: selectedMainCategory,
      subCategory: selectedSubCategory,
      detailCategory: selectedDetailCategory,
      name,
      quantity: typeof quantity === "string" ? 0 : quantity,
      unit,
      expirationDate,
      manufactureDate,
      storageMethod,
      remarks,
      adminRequest,
      icon,
    };

    addFridgeItem(newItem);

    Swal.fire({
      icon: "success",
      title: "등록 완료",
      text: "냉장고에 항목이 추가되었습니다.",
    });

    resetForm();
  };

  const resetForm = (): void => {
    setSelectedMainCategory("");
    setSelectedSubCategory("");
    setSelectedDetailCategory("");
    setName("");
    setQuantity("");
    setUnit("개");
    setExpirationDate("");
    setManufactureDate("");
    setStorageMethod("냉장");
    setRemarks("");
    setAdminRequest("");
    setIcon("");
  };

  return (
    <div className="fridge-register-body">
      <div className="fridge-register-container">
        {/* 아이콘 표시 */}
        {icon && (
          <div className="fridge-register-icon">
            <img src={icon} alt={name} />
          </div>
        )}

        <div className="fridge-register-dropdown-row">
          <div className="fridge-register-dropdown">
            <label>대분류</label>
            <select
              value={selectedMainCategory}
              onChange={(e) => setSelectedMainCategory(e.target.value)}
            >
              <option value="">선택</option>
              {Object.keys(CATEGORY_DATA).map((mainCategory) => (
                <option key={mainCategory} value={mainCategory}>
                  {mainCategory}
                </option>
              ))}
            </select>
          </div>

          {selectedMainCategory && (
            <div className="fridge-register-dropdown">
              <label>중분류</label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
              >
                <option value="">선택</option>
                {Object.keys(
                  CATEGORY_DATA[selectedMainCategory]?.중분류 || {}
                ).map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedSubCategory &&
            CATEGORY_DATA[selectedMainCategory]?.중분류?.[selectedSubCategory]
              ?.소분류 && (
              <div className="fridge-register-dropdown">
                <label>소분류</label>
                <select
                  value={selectedDetailCategory}
                  onChange={(e) => setSelectedDetailCategory(e.target.value)}
                >
                  <option value="">선택</option>
                  {Object.keys(
                    CATEGORY_DATA[selectedMainCategory]?.중분류?.[
                      selectedSubCategory
                    ]?.소분류 || {}
                  ).map((detailCategory) => (
                    <option key={detailCategory} value={detailCategory}>
                      {detailCategory}
                    </option>
                  ))}
                </select>
              </div>
            )}
        </div>

        {/* 추가 입력 필드 */}
        <div className="fridge-register-additional-fields">
          <div className="fridge-register-form-group">
            <label>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="재료 이름을 입력하세요"
            />
          </div>

          <div className="fridge-register-form-group">
            <label>수량</label>
            <div className="fridge-register-quantity-input">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || "")}
                placeholder="수량 입력"
              />
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="개">개</option>
                <option value="L">L</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>

          <div className="fridge-register-form-group">
            <label>소비기한</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          <div className="fridge-register-form-group">
            <label>제조일자</label>
            <input
              type="date"
              value={manufactureDate}
              onChange={(e) => setManufactureDate(e.target.value)}
            />
          </div>

          <div className="fridge-register-form-group">
            <label>보관방법</label>
            <div className="fridge-register-radio-group">
              <label>
                <input
                  type="radio"
                  name="storage"
                  value="냉장"
                  checked={storageMethod === "냉장"}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "냉장" ||
                      value === "냉동" ||
                      value === "실온"
                    ) {
                      setStorageMethod(value);
                    }
                  }}
                />
                냉장
              </label>
              <label>
                <input
                  type="radio"
                  name="storage"
                  value="냉동"
                  checked={storageMethod === "냉동"}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "냉장" ||
                      value === "냉동" ||
                      value === "실온"
                    ) {
                      setStorageMethod(value);
                    }
                  }}
                />
                냉동
              </label>
              <label>
                <input
                  type="radio"
                  name="storage"
                  value="실온"
                  checked={storageMethod === "실온"}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "냉장" ||
                      value === "냉동" ||
                      value === "실온"
                    ) {
                      setStorageMethod(value);
                    }
                  }}
                />
                실온
              </label>
            </div>
          </div>

          <div className="fridge-register-form-group">
            <label>비고</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="추가 정보를 입력하세요"
            ></textarea>
          </div>

          <div className="fridge-register-form-group">
            <label>관리자 요청</label>
            <input
              type="text"
              value={adminRequest}
              onChange={(e) => setAdminRequest(e.target.value)}
              placeholder="관리자 요청 사항 입력"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="fridge-register-buttons">
          <button className="fridge-register-button" onClick={handleRegister}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="22"
              viewBox="0 0 16 22"
              fill="none"
            >
              <path
                d="M16 11V21C16 21.2652 15.8946 21.5196 15.7071 21.7071C15.5196 21.8946 15.2652 22 15 22H1C0.734784 22 0.48043 21.8946 0.292893 21.7071C0.105357 21.5196 0 21.2652 0 21V11H16ZM5 13H3V18H5V13ZM15 0C15.2652 0 15.5196 0.105357 15.7071 0.292893C15.8946 0.48043 16 0.734784 16 1V9H0V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H15ZM5 3H3V7H5V3Z"
                fill="black"
              />
            </svg>
            등록하기
          </button>
          <button className="fridge-register-cancel-button" onClick={resetForm}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 14.7867L10 10.7867L14 14.7867L14.7867 14L10.7867 10L14.7867 6L14 5.21333L10 9.21333L6 5.21333L5.21333 6L9.21333 10L5.21333 14L6 14.7867ZM10.0033 20C8.62111 20 7.32111 19.7378 6.10333 19.2133C4.8863 18.6881 3.82741 17.9756 2.92667 17.0756C2.02593 16.1756 1.31296 15.1178 0.787778 13.9022C0.262593 12.6867 0 11.387 0 10.0033C0 8.61963 0.262593 7.31963 0.787778 6.10333C1.31222 4.8863 2.0237 3.82741 2.92222 2.92667C3.82074 2.02593 4.87889 1.31296 6.09667 0.787778C7.31445 0.262593 8.61444 0 9.99667 0C11.3789 0 12.6789 0.262593 13.8967 0.787778C15.1137 1.31222 16.1726 2.02407 17.0733 2.92333C17.9741 3.82259 18.687 4.88074 19.2122 6.09778C19.7374 7.31481 20 8.61444 20 9.99667C20 11.3789 19.7378 12.6789 19.2133 13.8967C18.6889 15.1144 17.9763 16.1733 17.0756 17.0733C16.1748 17.9733 15.117 18.6863 13.9022 19.2122C12.6874 19.7381 11.3878 20.0007 10.0033 20ZM10 18.8889C12.4815 18.8889 14.5833 18.0278 16.3056 16.3056C18.0278 14.5833 18.8889 12.4815 18.8889 10C18.8889 7.51852 18.0278 5.41667 16.3056 3.69444C14.5833 1.97222 12.4815 1.11111 10 1.11111C7.51852 1.11111 5.41667 1.97222 3.69444 3.69444C1.97222 5.41667 1.11111 7.51852 1.11111 10C1.11111 12.4815 1.97222 14.5833 3.69444 16.3056C5.41667 18.0278 7.51852 18.8889 10 18.8889Z"
                fill="black"
              />
            </svg>
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FridgeRegister;
