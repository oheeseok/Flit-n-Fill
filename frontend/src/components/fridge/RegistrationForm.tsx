// import React, { useState } from "react";
// import "../../styles/fridge/RegistrationForm.css";
// import { CATEGORY_DATA } from "../../data/categoryData";

// interface RegistrationFormProps {
//   onRegister: (data: {
//     mainCategory: string;
//     subCategory: string;
//     detailCategory: string | null;
//   }) => void;
// }

// const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
//   const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
//   const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
//   const [selectedDetailCategory, setSelectedDetailCategory] =
//     useState<string>("");

//   const handleMainCategoryChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSelectedMainCategory(event.target.value);
//     setSelectedSubCategory("");
//     setSelectedDetailCategory("");
//   };

//   const handleSubCategoryChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSelectedSubCategory(event.target.value);
//     setSelectedDetailCategory("");
//   };

//   const handleDetailCategoryChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSelectedDetailCategory(event.target.value);
//   };

//   const handleRegister = () => {
//     if (!selectedMainCategory || !selectedSubCategory) {
//       alert("대분류와 중분류를 선택해주세요.");
//       return;
//     }

//     const data = {
//       mainCategory: selectedMainCategory,
//       subCategory: selectedSubCategory,
//       detailCategory: selectedDetailCategory || null,
//     };

//     onRegister(data);

//     setSelectedMainCategory("");
//     setSelectedSubCategory("");
//     setSelectedDetailCategory("");
//   };

//   return (
//     <div className="registration-form">
//       <div className="dropdowns-row">
//         <div className="dropdown">
//           <label>대분류</label>
//           <select
//             value={selectedMainCategory}
//             onChange={handleMainCategoryChange}
//           >
//             <option value="">선택</option>
//             {Object.keys(CATEGORY_DATA).map((mainCategory) => (
//               <option key={mainCategory} value={mainCategory}>
//                 {mainCategory}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedMainCategory && (
//           <div className="dropdown">
//             <label>중분류</label>
//             <select
//               value={selectedSubCategory}
//               onChange={handleSubCategoryChange}
//             >
//               <option value="">선택</option>
//               {CATEGORY_DATA[selectedMainCategory].중분류.map((subCategory) => (
//                 <option key={subCategory} value={subCategory}>
//                   {subCategory}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {selectedSubCategory &&
//           CATEGORY_DATA[selectedMainCategory].소분류[selectedSubCategory] && (
//             <div className="dropdown">
//               <label>소분류</label>
//               <select
//                 value={selectedDetailCategory}
//                 onChange={handleDetailCategoryChange}
//               >
//                 <option value="">선택</option>
//                 {CATEGORY_DATA[selectedMainCategory].소분류[
//                   selectedSubCategory
//                 ].map((detailCategory) => (
//                   <option key={detailCategory} value={detailCategory}>
//                     {detailCategory}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//       </div>

//       <div className="form-buttons">
//         <button className="register-button" onClick={handleRegister}>
//           등록하기
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RegistrationForm;
