import ToRegisterButton from "../../components/fridge/ToRegisterButton";
import ToRecipeButton from "../../components/fridge/ToRecipeButton";
import ToCommunityButton from "../../components/fridge/ToCommunityButton";
import "../../styles/fridge/Fridge.css";

const Fridge = () => {
  return (
    <>
      <div className="fridge-toregister-button-container">
        <ToRegisterButton></ToRegisterButton>
      </div>
      <div className="fridgebody">
        <div className="fridge-container">
          <div className="cold-container">
            <div className="cold-side">
              cold area
              <div className="cold-back"></div>
            </div>
          </div>
          <div className="cold-door"></div>
          <div className="cold-door-hand"></div>

          <div className="freeze-container">
            <div className="freeze-side">
              <div className="freeze-back">freeze area</div>
            </div>
          </div>
          <div className="freeze-door"></div>
          <div className="freeze-door-hand"></div>
        </div>
        <div className="out-container">
          <div className="out-side">
            <div className="out-area1">room temperature area</div>
            <div className="out-frame"></div>
            <div className="out-area2"></div>
            <div className="out-frame"></div>
            <div className="out-area3"></div>
          </div>
        </div>
        <div className="bucket-container">
          <div className="bucket-side">
            <div className="bucket-area">bucket area</div>
          </div>
        </div>
        <div className="button-container">
          <ToRecipeButton></ToRecipeButton>
          <ToCommunityButton></ToCommunityButton>
        </div>
      </div>
    </>
  );
};
export default Fridge;
