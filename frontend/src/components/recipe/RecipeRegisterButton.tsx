import { Link } from "react-router-dom";
import "../../styles/recipe/RecipeRegisterButton.css";

const RecipeRegisterButton = () => {
  return (
    <div>
      <Link to="/recipe/register">
        <button className="recipe-register-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 12.2344H2.75C2.75 16.8424 8.5485 20.8044 8.5485 20.8044H12"
              stroke="#3C3C3C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.44202 13.2872C5.44202 16.6832 9.25602 19.1892 9.25602 19.1892M12 12.2342H21.25C21.25 16.8422 15.4515 20.8042 15.4515 20.8042H12M7.04702 12.2342C6.37402 9.7147 10.874 7.9827 14.912 7.4477L15.307 6.7207L16.899 8.6557L16.0255 8.7977C15.598 10.2027 13.458 12.2342 13.458 12.2342"
              stroke="#3C3C3C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.755 12.2341C7.899 10.9371 9.403 9.47711 15.141 7.72461"
              stroke="#3C3C3C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.289 7.90526C13.119 8.99226 10.589 10.2413 8.81604 12.2343M15.7125 8.41876C13.4575 11.4818 12 12.2343 12 12.2343M10.7525 12.2343C12.1125 11.4393 15.4975 8.15726 15.4975 8.15726M16.5385 8.22676L20.614 4.92426C20.681 4.87009 20.7367 4.80324 20.7778 4.72753C20.819 4.65181 20.8447 4.56873 20.8537 4.48304C20.8627 4.39734 20.8546 4.31072 20.8301 4.22814C20.8055 4.14555 20.7649 4.06862 20.7105 4.00176C20.6564 3.93483 20.5895 3.87923 20.5139 3.83815C20.4382 3.79707 20.3552 3.77131 20.2695 3.76235C20.1839 3.75338 20.0974 3.76139 20.0148 3.78592C19.9323 3.81044 19.8554 3.85099 19.7885 3.90526L15.7125 7.20776"
              stroke="#3C3C3C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          등록하기
        </button>
      </Link>
    </div>
  );
};
export default RecipeRegisterButton;
