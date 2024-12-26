import { Link } from "react-router-dom";
import "../../styles/fridge/ToRegisterButton.css";

const ToRegisterButton = () => {
  return (
    <div>
      <Link className="to-fridge-register" to="/fridge/register">
        <button className="to-register-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="27"
            viewBox="0 0 16 27"
            fill="none"
          >
            <path
              d="M16 13.0356V24.8862C16 25.2005 15.8946 25.5019 15.7071 25.7242C15.5196 25.9464 15.2652 26.0713 15 26.0713H1C0.734784 26.0713 0.48043 25.9464 0.292893 25.7242C0.105357 25.5019 0 25.2005 0 24.8862V13.0356H16ZM5 15.4057H3V21.331H5V15.4057ZM15 0C15.2652 0 15.5196 0.124854 15.7071 0.347095C15.8946 0.569337 16 0.870761 16 1.18506V10.6655H0V1.18506C0 0.870761 0.105357 0.569337 0.292893 0.347095C0.48043 0.124854 0.734784 0 1 0H15ZM5 3.55517H3V8.2954H5V3.55517Z"
              fill="black"
            />
          </svg>
          등록하기
        </button>
      </Link>
    </div>
  );
};
export default ToRegisterButton;
