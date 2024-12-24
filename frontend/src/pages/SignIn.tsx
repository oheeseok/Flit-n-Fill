import "../styles/common/SignIn.css";
import { useState, ChangeEvent } from "react";
import axios from "axios";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await axios.post<string>("/api/user/login", {
        userEmail: email,
        userPassword: password,
      });
      console.log(response);
      alert(response.data); // 로그인 성공 메시지
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data); // 서버에서 받은 에러 메시지
      } else {
        alert("로그인 요청 중 오류가 발생했습니다.");
      }
    }
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
      <>
        <div className="signinbody">
          <div className="signin-container">
            <div className="signin-title">Welcome back!</div>
            <div className="signin-title-2">
              Enter your Credentials to access your account
            </div>
            <div className="signin-text">Email address</div>
            <input
                type="text"
                className="signin-input"
                placeholder="Enter your email"
                value={email}
                onChange={handleChangeEmail}
            />
            <div className="signin-text">Password</div>
            <input
                type="password"
                className="signin-input"
                placeholder="Enter your password"
                value={password}
                onChange={handleChangePassword}
            />
            <label>
              <input type="checkbox" />
              Remember your id
            </label>
            <button onClick={handleLogin}>Log In</button>
            <div>---------or---------</div>
            <button>구글로그인</button>
            <button>카카오로그인</button>
            <div>Don't have an account? Sign In</div>
          </div>
          <div className="signin-image"></div>
        </div>
      </>
  );
};

export default SignIn;
