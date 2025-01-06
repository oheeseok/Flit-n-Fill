import "../../styles/common/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <ul className="footer-menu">
        <li>
          <a href="javascript:void(0)" className="footer-color">
            개인정보처리방침
          </a>
        </li>
        <li>
          <a href="javascript:void(0)">홈페이지 이용약관</a>
        </li>
        <li>
          <a href="javascript:void(0)">위치정보 이용약관</a>
        </li>
        <li>
          <a href="javascript:void(0)">flit n fill 이용약관</a>
        </li>
        <li>
          <a href="javascript:void(0)">이용안내</a>
        </li>
      </ul>

      <div className="footer-btn-group">
        <a href="javascript:void(0)" className="btn btn--white">
          찾아오시는 길
        </a>
        <a href="javascript:void(0)" className="btn btn--white">
          고객 센터
        </a>
        <a href="javascript:void(0)" className="btn btn--white">
          FAQ
        </a>
      </div>

      <div className="footer-info">
        <span>사업자등록번호 220-82-03984</span>
        <span>flit & fill 대표이사 한 별</span>
        <span>TEL : 0507) 1309-9319</span>
        <span>경기도 성남시 성남대로 34 하나플라자 6층</span>
      </div>

      <p className="footer-copyright">
        &copy; <span className="this-year"></span> flit & fill Company. All
        Rights Reserved.
      </p>
    </div>
  );
};
export default Footer;
