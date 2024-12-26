import "../styles/common/SignIn.css";

const SignIn = () => {
  const handleGoogleLogin = () => {
    // 백엔드에서 설정한 Google OAuth2 인증 엔드포인트로 리디렉션
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleKakaoLogin = () => {
    // 백엔드에서 설정한 Kakao OAuth2 인증 엔드포인트로 리디렉션
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
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
          />
          <div className="signin-text">Password</div>
          <input
            type="password"
            className="signin-input"
            placeholder="Enter your password"
          />
          <label>
            <input type="checkbox" />
            Remember your id
          </label>
          <button>Log In</button>
          <div>---------or---------</div>
          <button onClick={handleGoogleLogin}>Google Login</button>
          <button onClick={handleKakaoLogin}>Kakao Login</button>
          <div>Don't have an account? Sign Up</div>
        </div>
        <div className="signin-image"></div>
      </div>
    </>
  );
};

export default SignIn;
