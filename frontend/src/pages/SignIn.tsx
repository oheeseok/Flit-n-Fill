import "../styles/common/SignIn.css";

const SignIn = () => {
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
            type="text"
            className="signin-input"
            placeholder="Enter your password"
          />
          <label>
            <input type="checkbox" />
            Remember your id
          </label>
          <button>Log In</button>
          <div>---------or---------</div>
          <button>구글로그인</button>
          <button>카카오로그인</button>
          <div>Don't have an acccount? Sign In</div>
        </div>
        <div className="signin-image"></div>
      </div>
    </>
  );
};
export default SignIn;
