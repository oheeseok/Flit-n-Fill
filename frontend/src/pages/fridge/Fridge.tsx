import React, { useEffect, useState } from "react";
import ToRegisterButton from "../../components/fridge/ToRegisterButton";
import ToRecipeButton from "../../components/fridge/ToRecipeButton";
import ToCommunityButton from "../../components/fridge/ToCommunityButton";
import { useFridge, FridgeItem } from "../../context/FridgeContext";
import "../../styles/fridge/Fridge.css";
import Swal from "sweetalert2";
// FridgeItem 타입 정의
// interface FridgeItem {
//   id: number;
//   name: string;
//   icon: string;
//   quantity: number;
//   unit: string;
//   expirationDate: string;
//   manufactureDate: string;
//   storageMethod: "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE";
//   remarks: string;
//   mainCategory: string;
//   subCategory: string;
//   detailCategory: string;
// }

const Fridge: React.FC = () => {
  const {
    fridgeItems,
    removeFridgeItem,
    updateFridgeItem,
    fetchFridgeItems,
    addFridgeItemToCart,
  } = useFridge();
  const { bucketItems, addToBucket, removeFromBucket } = useFridge(); // FridgeContext에서 가져옴
  // const [bucketItems, setBucketItems] = useState<FridgeItem[]>([]); 이거 fridgecontext에서 사용하자자
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editedQuantity, setEditedQuantity] = useState<number | "">("");
  const [editedUnit, setEditedUnit] = useState<string>("PIECE");
  const [editedExpirationDate, setEditedExpirationDate] = useState<string>("");
  const [editedManufactureDate, setEditedManufactureDate] =
    useState<string>("");
  const [editedStorageMethod, setEditedStorageMethod] = useState<
    "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE"
  >("REFRIGERATED");
  const [editedRemarks, setEditedRemarks] = useState<string>("");

  // 냉장고 재료 가져오기
  useEffect(() => {
    fetchFridgeItems();
    console.log("Fetching items...", fridgeItems);
  }, []);

  useEffect(() => {
    console.log("Fridge items updated:", fridgeItems);
  }, [fridgeItems]); // fridgeItems 변경시 렌더링

  // 수정 버튼 클릭
  const handleEditClick = (id: number) => {
    const item = fridgeItems.find((item) => item.id === id); // number 타입 id로 검색
    if (item) {
      setEditingItemId(id);
      setEditedQuantity(item.quantity);
      setEditedUnit(item.unit);
      setEditedExpirationDate(item.expirationDate);
      setEditedManufactureDate(item.manufactureDate);
      setEditedStorageMethod(item.storageMethod);
      setEditedRemarks(item.remarks);
    }
  };

  // 저장 버튼 클릭
  const handleSaveEdit = (): void => {
    if (editingItemId !== null) {
      // 유효성 검사 함수
      const validateInput = (): boolean => {
        const errorMessages = [
          {
            condition: editedQuantity === "" || editedQuantity === 0,
            message: "수량을 입력해주세요.",
          },
          {
            condition: new Date(editedExpirationDate) <= new Date(),
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

      let updatedItem: Partial<FridgeItem> = {
        id: editingItemId,
        quantity: editedQuantity === "" ? 0 : editedQuantity,
        unit: editedUnit,
        expirationDate: editedExpirationDate,
        manufactureDate: editedManufactureDate,
        storageMethod: editedStorageMethod,
        remarks: editedRemarks,
      };

      // 업데이트된 항목 전송
      updateFridgeItem(updatedItem)
        .then(() => {
          // 성공 시 알림
          Swal.fire({
            icon: "success",
            title: "수정 완료",
            text: "냉장고 항목이 수정되었습니다.",
          });
        })
        .catch((error: Error) => {
          // 실패 시 알림
          Swal.fire({
            icon: "error",
            title: "수정 실패",
            text: error.message,
          });
          console.error("Error updating fridge item", error);
        });

      setEditingItemId(null);
    }
  };

  // 아이템 렌더링
  const renderItems = (
    items: FridgeItem[],
    storageMethod: "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE"
  ) => {
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]); // 다중 선택 상태 관리

    const handleItemClick = (id: number, foodListId: number | undefined) => {
      if (foodListId === null) {
        return;
      }
      setSelectedItemIds((prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id]
      ); // 이미 선택된 경우 제거, 아니면 추가
    };

    return items
      .filter((item) => item.storageMethod === storageMethod)
      .map((item) => (
        <div
          className={`fridge-item ${
            selectedItemIds.includes(item.id) ? "selected" : ""
          }`}
          key={item.id} // number 타입 id 사용
          style={{ position: "relative" }}
          onClick={() => handleItemClick(item.id, item.foodListId)}
        >
          <div className="fridge-item-name">{item.name}</div>
          <img
            className="fridge-item-icon"
            src={item.icon}
            alt={item.name}
            onClick={() => addToBucket(item)} // 아이콘 클릭 시 버킷에 추가
          />
          <div className="fridge-item-expiration">{item.expirationDate}</div>

          <div className="fridge-item-actions">
            <img
              src="/assets/edit.png"
              alt="수정"
              className="fridge-item-edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(item.id);
              }}
            />
            <img
              src="/assets/delete.png"
              alt="삭제"
              className="fridge-item-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                Swal.fire({
                  title: "삭제하시겠습니까?",
                  text: `${item.name}을(를) 삭제하시겠습니까?`,

                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#d33",
                  cancelButtonColor: "#3085d6",
                  confirmButtonText: "삭제",
                  cancelButtonText: "취소",
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      title: "장바구니에 추가하시겠습니까?",
                      text: `${item.name}을(를) 장바구니에 추가하시겠습니까?`,
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#3085d6",
                      confirmButtonText: "추가",
                      cancelButtonText: "취소",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        addFridgeItemToCart(item.id);
                        // removeFridgeItem(item.id); // 삭제 로직 호출
                        Swal.fire({
                          title: "장바구니에 추가되었습니다!",
                          icon: "success",
                          confirmButtonColor: "#d33",
                          confirmButtonText: "확인",
                        });
                      } else {
                        // removeFridgeItem(item.id); // 삭제 로직 호출
                        Swal.fire(
                          "삭제 완료",
                          `${item.name}이(가) 삭제되었습니다.`,
                          "success"
                        );
                      }
                      removeFridgeItem(item.id); // 삭제 로직 호출
                    });
                  }
                });
              }}
            />
          </div>
        </div>
      ));
  };

  // 버킷 렌더링
  const renderBucketItems = () => {
    return bucketItems.map(
      (
        item: FridgeItem // `item` 타입 명시
      ) => (
        <div
          className="fridge-item"
          key={item.id}
          style={{ position: "relative" }}
        >
          <div className="fridge-item-name">{item.name}</div>
          <img
            className="fridge-item-icon"
            src={item.icon}
            alt={item.name}
            onClick={() => addToBucket(item)} // 버킷에 추가
          />
          <div className="fridge-item-expiration">{item.expirationDate}</div>
          <div className="fridge-item-actions">
            <img
              src="/assets/edit.png"
              alt="수정"
              className="bucket-item-edit-icon"
              onClick={() => handleEditClick(item.id)} // 수정 팝업 호출
            />
            <img
              src="/assets/delete.png"
              alt="삭제"
              className="bucket-item-delete-icon"
              onClick={() => removeFromBucket(item.id)} // 버킷 내 삭제
            />
          </div>
        </div>
      )
    );
  };

  return (
    <>
      <div className="fridge-toregister-button-container">
        <ToRegisterButton />
      </div>
      <div className="fridgebody">
        <div className="fridge-container">
          <div className="cold-container">
            <div className="cold-side">
              냉장
              <div className="cold-back">
                {renderItems(fridgeItems, "REFRIGERATED")}
              </div>
            </div>
          </div>
          <div className="freeze-container">
            <div className="freeze-side">
              <div className="freeze-back">
                {renderItems(fridgeItems, "FROZEN")}
              </div>
              냉동
            </div>
          </div>
        </div>
        <div className="out-container">
          <div className="out-side">
            실온
            <div className="out-back">
              {renderItems(fridgeItems, "ROOM_TEMPERATURE")}
            </div>
          </div>
        </div>
        <div className="bucket-container">
          <div className="bucket-side">
            <div className="bucket-area">{renderBucketItems()}</div>
          </div>
        </div>
        <div className="button-container">
          <ToRecipeButton />
          {bucketItems.length == 1 && (
            <ToCommunityButton bucketItemId={bucketItems[0].id} />
          )}
        </div>
      </div>

      {/* 수정 팝업 */}
      {editingItemId !== null && (
        <div className="edit-popup">
          <h3>{fridgeItems.find((item) => item.id === editingItemId)?.name}</h3>
          <div>
            <label>수량:</label>
            <input
              type="number"
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(Number(e.target.value))}
            />
          </div>
          <div>
            <label>단위:</label>
            <select
              value={editedUnit}
              onChange={(e) => setEditedUnit(e.target.value)}
            >
              <option value="PIECE">개</option>
              <option value="G">g</option>
              <option value="KG">kg</option>
              <option value="ML">mL</option>
              <option value="L">L</option>
            </select>
          </div>
          <div>
            s<label>소비기한:</label>
            <input
              type="date"
              value={editedExpirationDate}
              onChange={(e) => setEditedExpirationDate(e.target.value)}
            />
          </div>
          <div>
            <label>제조일자:</label>
            <input
              type="date"
              value={editedManufactureDate}
              onChange={(e) => setEditedManufactureDate(e.target.value)}
            />
          </div>
          <div>
            <label>보관방법:</label>
            <div className="edit-radio-group">
              <label>
                <input
                  type="radio"
                  value="REFRIGERATED"
                  checked={editedStorageMethod === "REFRIGERATED"}
                  onChange={() => setEditedStorageMethod("REFRIGERATED")}
                />
                냉장
              </label>
              <label>
                <input
                  type="radio"
                  value="FROZONE"
                  checked={editedStorageMethod === "FROZEN"}
                  onChange={() => setEditedStorageMethod("FROZEN")}
                />
                냉동
              </label>
              <label>
                <input
                  type="radio"
                  value="ROOM_TEMPERATURE"
                  checked={editedStorageMethod === "ROOM_TEMPERATURE"}
                  onChange={() => setEditedStorageMethod("ROOM_TEMPERATURE")}
                />
                실온
              </label>
            </div>
          </div>
          <div>
            <label>비고:</label>
            <textarea
              value={editedRemarks}
              onChange={(e) => setEditedRemarks(e.target.value)}
            ></textarea>
          </div>
          <button className="edit" onClick={handleSaveEdit}>
            저장
          </button>
          <button onClick={() => setEditingItemId(null)}>취소</button>
        </div>
      )}
    </>
  );
};

export default Fridge;
