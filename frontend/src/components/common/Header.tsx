import Icon from "../../assets/icon.png";
import "../../styles/common/Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <Link to="/" className="logo">
        <img src={Icon} alt="Flit-n-Fill" />
      </Link>

      <ul className="headermenu">
        <Link to="/fridge">fridge</Link>
        <Link to="/recipe">recipe</Link>
        <Link to="/community">community</Link>
        <Link to="/cart">cart</Link>
        <Link to="/signin">sign in</Link>
        <Link to="/signup">sign up</Link>
      </ul>
    </div>
  );
};
export default Header;
