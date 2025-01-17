import { Link } from "react-router-dom";
import "../../styles/fridge/ToPostButton.css";

const ToPostButton = () => {
  return (
    <div>
      <Link className="to-coummunity-register" to="/post">
        <button className="to-coummunity-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21.822 7.431C21.73 7.29808 21.6072 7.18943 21.464 7.11436C21.3209 7.0393 21.1616 7.00006 21 7H7.333L6.179 4.23C6.02769 3.86523 5.77147 3.55359 5.44282 3.33462C5.11418 3.11564 4.72791 2.99918 4.333 3H2V5H4.333L9.077 16.385C9.15299 16.5672 9.28118 16.7228 9.44542 16.8322C9.60967 16.9416 9.80263 17 10 17H18C18.417 17 18.79 16.741 18.937 16.352L21.937 8.352C21.9937 8.20063 22.0129 8.03776 21.9928 7.87735C21.9728 7.71695 21.9142 7.56379 21.822 7.431ZM17.307 15H10.667L8.167 9H19.557L17.307 15Z"
              fill="#3C3C3C"
            />
            <path
              d="M10.5 21C11.3284 21 12 20.3284 12 19.5C12 18.6716 11.3284 18 10.5 18C9.67157 18 9 18.6716 9 19.5C9 20.3284 9.67157 21 10.5 21Z"
              fill="#3C3C3C"
            />
            <path
              d="M17.5 21C18.3284 21 19 20.3284 19 19.5C19 18.6716 18.3284 18 17.5 18C16.6716 18 16 18.6716 16 19.5C16 20.3284 16.6716 21 17.5 21Z"
              fill="#3C3C3C"
            />
          </svg>
          교환/나눔 하기
        </button>
      </Link>
    </div>
  );
};
export default ToPostButton;
