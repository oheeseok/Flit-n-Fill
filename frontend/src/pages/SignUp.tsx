import "../styles/common/SignUp.css";

const SignUp = () => {
  return (
    <>
      <div className="signupbody">
        <div className="signup-container">
          <div className="signup-title">Get Started Now</div>
          <div className="signup-text">Name</div>
          <input type="text" placeholder="Enter your name" />
          <div className="signup-text">Email address</div>
          <input type="text" placeholder="Enter your email" />
          <div className="signup-text">Password</div>
          <input type="text" placeholder="Enter your password" />
          <button>Sign Up</button>
          <div>---------or---------</div>
          <button>구글로그인</button>
          <button>카카오로그인</button>
          <div>Have an account? Sign In</div>
        </div>
        <div className="signup-image"></div>
      </div>
    </>
  );
};
export default SignUp;