import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../styles/fridge/FridgeRegister.css";
import { useFridge } from "../../context/FridgeContext";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// import FridgeSearchBar from "../../components/fridge/FridgeSearchBar.tsx";

const FridgeRegister = () => {
  const { addFridgeItem, requestAddIngredient } = useFridge();
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedDetailCategory, setSelectedDetailCategory] =
    useState<string>("");
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState<string>("PIECE");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [manufactureDate, setManufactureDate] = useState<string>("");
  const [storageMethod, setStorageMethod] = useState<
    "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE"
  >("REFRIGERATED");
  const [remarks, setRemarks] = useState<string>("");
  const [adminRequest, setAdminRequest] = useState<string>("");
  const [foodListId, setFoodListId] = useState<string>("");
  const [requestContext, setRequestContext] = useState<string>("");
  const [requestPopupOpen, setRequestPopupOpen] = useState(false);
  // const [categories, setCategories] = useState([]);
  const [categories, setCategories] = useState<Record<string, GroupedCategory>>(
    {}
  );

  // 상태 관리: 재료/완제품
  const [ingredientType, setIngredientType] = useState<"INGREDIENT" | "COOKED">(
    "INGREDIENT"
  );

  interface FoodListViewDto {
    foodListId: number; // Long -> number
    foodListGroup: string;
    foodListType: string | null; // Optional일 수 있으므로 null 허용
    foodListProduct: string | null; // Optional일 수 있으므로 null 허용
    foodListIcon: number;
  }

  // 수정 여기부터
  interface SubCategory {
    foodListIcon: number;
    foodListId: number;
    소분류: Record<string, { foodListIcon: number; foodListId: number } | null>;
  }

  interface GroupedCategory {
    대분류: string;
    중분류: Record<string, SubCategory>;
  }
  // 수정 여기까지

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/foodlist`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        });

        const groupedData = response.data.reduce(
          (
            acc: Record<string, any>, // acc 타입 명시
            {
              foodListGroup,
              foodListProduct,
              foodListType,
              foodListIcon,
              foodListId,
            }: FoodListViewDto // 구조 분해한 객체 타입 명시
          ) => {
            if (!acc[foodListGroup]) {
              acc[foodListGroup] = {
                대분류: foodListGroup,
                중분류: {},
              };
            }

            if (foodListType) {
              if (!acc[foodListGroup].중분류[foodListType]) {
                acc[foodListGroup].중분류[foodListType] = {
                  foodListIcon: foodListIcon,
                  foodListId,
                  소분류: {},
                };
              }

              if (foodListProduct !== null) {
                acc[foodListGroup].중분류[foodListType].소분류[
                  foodListProduct
                ] = {
                  foodListIcon: foodListIcon,
                  foodListId,
                };
              }
            } else {
              if (foodListProduct !== null) {
                acc[foodListGroup].중분류[foodListProduct] = {
                  foodListIcon: foodListIcon,
                  소분류: null,
                  foodListId,
                };
              }
            }
            return acc;
          },
          {}
        );

        console.log(groupedData);
        setCategories(groupedData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // 아이콘 경로 상태
  const [icon, setIcon] = useState<string>("");

  useEffect(() => {
    // 이름 및 아이콘 업데이트
    if (ingredientType === "COOKED") {
      setIcon("../../assets/icons/instant-food.png"); // 완제품 아이콘
      return;
    }
    if (selectedDetailCategory) {
      setName(selectedDetailCategory);
      const newicon =
        "../../assets/icons/" +
          categories[selectedMainCategory]?.중분류[selectedSubCategory]?.소분류[
            selectedDetailCategory
          ]?.foodListIcon +
          ".png" || "";
      const newfoodListId =
        categories[selectedMainCategory]?.중분류[selectedSubCategory]?.소분류[
          selectedDetailCategory
        ]?.foodListId || "";
      setIcon(newicon);
      setFoodListId(newfoodListId.toString());
    } else if (selectedSubCategory) {
      setName(selectedSubCategory);
      const newicon =
        "../../assets/icons/" +
          categories[selectedMainCategory]?.중분류[selectedSubCategory]
            ?.foodListIcon +
          ".png" || "";
      const newfoodListId =
        categories[selectedMainCategory]?.중분류[selectedSubCategory]
          ?.foodListId || "";
      setIcon(newicon);
      setFoodListId(newfoodListId.toString());
    } else {
      setName("");
      setIcon("");
      setFoodListId(""); // foodListId 초기화
    }
  }, [
    selectedMainCategory,
    selectedSubCategory,
    selectedDetailCategory,
    categories,
    ingredientType,
  ]);

  useEffect(() => {
    // 오늘 날짜를 구하고 YYYY-MM-DD 형식으로 변환
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    setExpirationDate(formattedDate); // 기본값으로 설정
    setManufactureDate(formattedDate);
  }, []);

  const handleRegister = (): void => {
    // 유효성 검사 함수
    const validateInput = (): boolean => {
      const errorMessages = [
        {
          condition:
            ingredientType !== "COOKED" &&
            (!selectedMainCategory || !selectedSubCategory),
          message: "대분류와 중분류를 선택해주세요.",
        },
        {
          condition: ingredientType !== "COOKED" && !foodListId,
          message: "유효한 식별자를 선택해주세요.",
        },
        {
          condition: ingredientType === "COOKED" && !name,
          message: "음식의 이름을 입력해주세요.",
        },
        {
          condition: quantity === "" || quantity === 0,
          message: "수량을 입력해주세요.",
        },
        {
          condition: new Date(expirationDate) <= new Date(),
          message: "소비기한은 오늘 이후 날짜로 설정해야 합니다.",
        },
      ];

      for (const { condition, message } of errorMessages) {
        if (condition) {
          Swal.fire({
            icon: "error",
            title: "입력 오류",
            text: message,
          });
          return false;
        }
      }

      return true;
    };

    // 유효성 검사 통과하지 못하면 중단
    if (!validateInput()) return;

    // 새로운 항목 생성
    const newItem = {
      id: Number(foodListId), // 백엔드에서 제공된 식별자를 사용
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
      foodListId: Number(foodListId), // 타입 변환
    };

    // 항목 추가
    addFridgeItem(newItem);

    // 성공 메시지
    Swal.fire({
      icon: "success",
      title: "등록 완료",
      text: "냉장고에 항목이 추가되었습니다.",
    }).then(() => {
      // Swal 확인 버튼 클릭 후 실행
      window.location.href = "/fridge";
    });

    // 폼 초기화
    resetForm();
  };

  // 재료/완제품 핸들러
  const handleIngredientTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value as "INGREDIENT" | "COOKED";
    setIngredientType(value);

    if (value === "COOKED") {
      setIcon("/assets/instant-food.png");
      setName("");
      setSelectedMainCategory("");
      setSelectedSubCategory("");
      setSelectedDetailCategory("");
    } else {
      setIcon("");
    }
  };

  const resetForm = (): void => {
    setSelectedMainCategory("");
    setSelectedSubCategory("");
    setSelectedDetailCategory("");
    setName("");
    setQuantity("");
    setUnit("PIECE");
    setExpirationDate("");
    setManufactureDate("");
    setStorageMethod("REFRIGERATED");
    setRemarks("");
    setAdminRequest("");
    setIcon("");
    setFoodListId("");
  };

  const handleRequestRegister = (): void => {
    if (!requestContext) {
      alert("요청할 재료 이름을 입력해주세요.");
      return;
    }

    try {
      // string 그대로 전달
      requestAddIngredient(requestContext);

      Swal.fire({
        icon: "success",
        title: "등록 완료",
        text: "재료 등록 요청에 성공하였습니다.",
      });
      setRequestContext(""); // 입력 필드 초기화
      setRequestPopupOpen(false); // 팝업 닫기
    } catch (error) {
      console.error("재료 등록 요청 실패:", error);
      Swal.fire({
        icon: "error",
        title: "요청 에러",
        text: "재료 등록 요청에 하였습니다.",
      });
    }
  };

  // onSearch 함수 정의
  // const handleSearch = (
  //   mainCategory: string,
  //   subCategory?: string,
  //   detailCategory?: string
  // ) => {
  //   console.log(mainCategory, subCategory, detailCategory);
  //   setSelectedMainCategory(mainCategory || "");
  //   setSelectedSubCategory(subCategory || "");
  //   setSelectedDetailCategory(detailCategory || "");

  //   console.log("selectedMain:", selectedMainCategory);
  //   console.log("selectedSub:", selectedSubCategory);
  //   console.log("selectedDetail:", selectedDetailCategory);
  // };

  const handleMainCategoryChangee = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCategory = e.target.value;

    // Main Category 변경 시 상태 초기화
    setSelectedMainCategory(newCategory);
    setSelectedSubCategory("");
    setSelectedDetailCategory("");
    setName("");
    setQuantity("");
    setUnit("PIECE");
    setStorageMethod("REFRIGERATED");
    setRemarks("");
    setAdminRequest("");
    setIcon("");
    setFoodListId("");
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubCategory = e.target.value;

    // Sub Category 변경 시 상태 초기화
    setSelectedSubCategory(newSubCategory);
    setSelectedDetailCategory("");
    setName("");
    setQuantity("");
    setUnit("PIECE");
    setStorageMethod("REFRIGERATED");
    setRemarks("");
    setAdminRequest("");
    setIcon("");
    setFoodListId("");
  };

  const handleDetailCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newDetailCategory = e.target.value;

    // Detail Category 변경 시 상태 초기화
    setSelectedDetailCategory(newDetailCategory);
    setName("");
    setQuantity("");
    setUnit("PIECE");
    setStorageMethod("REFRIGERATED");
    setRemarks("");
    setAdminRequest("");
    setIcon("");
    setFoodListId("");
  };

  return (
    <div className="fridge-register-body">
      <div className="fridge-register-container">
        <div className="fridge-register-category-group">
          {/* 완제품 표시 */}
          <label>
            <input
              type="radio"
              name="ingredientType"
              value="INGREDIENT"
              checked={ingredientType === "INGREDIENT"}
              onChange={handleIngredientTypeChange}
            />
            재료
          </label>
          <label>
            <input
              type="radio"
              name="ingredientType"
              value="COOKED"
              checked={ingredientType === "COOKED"}
              onChange={handleIngredientTypeChange}
            />
            완제품
          </label>
        </div>

        {/* 서치바 */}
        {/* <div className="fridge-register-searchbar">
          <FridgeSearchBar
            onSearch={handleSearch}
            categories={categories}
            disabled={ingredientType === "COOKED"}
          ></FridgeSearchBar>
        </div> */}

        {/* 아이콘 표시 */}
        {icon && (
          <div className="fridge-register-icon">
            <img src={icon} alt={name || "아이콘"} />
          </div>
        )}

        <div className="fridge-register-dropdown-row">
          <div className="fridge-register-dropdown">
            <label>대분류</label>
            <select
              value={selectedMainCategory}
              onChange={handleMainCategoryChangee}
              disabled={ingredientType === "COOKED"}
            >
              <option value="">선택</option>
              {Object.keys(categories).map((mainCategory) => (
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
                onChange={handleSubCategoryChange}
              >
                <option value="">선택</option>
                {Object.keys(
                  categories[selectedMainCategory]?.중분류 || {}
                ).map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedSubCategory &&
            categories[selectedMainCategory]?.중분류[selectedSubCategory]
              ?.소분류 &&
            Object.keys(
              categories[selectedMainCategory].중분류[selectedSubCategory]
                .소분류
            ).length > 0 && (
              <div className="fridge-register-dropdown">
                <label>소분류</label>
                <select
                  value={selectedDetailCategory}
                  onChange={handleDetailCategoryChange}
                >
                  <option value="">선택</option>
                  {Object.keys(
                    categories[selectedMainCategory]?.중분류[
                      selectedSubCategory
                    ].소분류 || {}
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
              readOnly={ingredientType === "INGREDIENT"}
            />
          </div>

          <div className="fridge-register-form-group">
            <label>수량</label>
            <div className="fridge-register-quantity-input">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                placeholder="수량 입력"
                min="0"
              />
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="PIECE">개</option>
                <option value="G">g</option>
                <option value="KG">Kg</option>
                <option value="ML">mL</option>
                <option value="L">L</option>
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
                  value="REFRIGERATED"
                  checked={storageMethod === "REFRIGERATED"}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "REFRIGERATED" ||
                      value === "FROZEN" ||
                      value === "ROOM_TEMPERATURE"
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
                  value="FROZEN"
                  checked={storageMethod === "FROZEN"}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "REFRIGERATED" ||
                      value === "FROZEN" ||
                      value === "ROOM_TEMPERATURE"
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
                  value="ROOM_TEMPERATURE"
                  checked={storageMethod === "ROOM_TEMPERATURE"}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "REFRIGERATED" ||
                      value === "FROZEN" ||
                      value === "ROOM_TEMPERATURE"
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

          {/* <div className="fridge-register-form-group">
            <label>관리자 요청</label>
            <input
              type="text"
              value={adminRequest}
              onChange={(e) => setAdminRequest(e.target.value)}
              placeholder="관리자 요청 사항 입력"
            />
          </div> */}
        </div>

        {/* 버튼 */}
        <div className="fridge-register-buttons">
          <button
            className="fridge-register-cancel-button"
            onClick={() => setRequestPopupOpen(true)}
          >
            {/* <svg
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
            </svg> */}
            재료 등록요청
          </button>
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
      {/* 수정 팝업 */}
      {requestPopupOpen && (
        <div className="edit-popup">
          <h3>재료 등록 요청하기</h3>
          <div>
            <label>요청하실 재료를 입력해주세요.</label>
            <textarea
              value={requestContext}
              onChange={(e) => setRequestContext(e.target.value)}
            ></textarea>
          </div>
          <button className="edit" onClick={handleRequestRegister}>
            요청
          </button>
          <button onClick={() => setRequestPopupOpen(false)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default FridgeRegister;
