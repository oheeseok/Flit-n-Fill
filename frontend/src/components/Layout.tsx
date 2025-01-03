import React from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import ScrollToTop from "./common/ScrollToTop"; // ScrollToTop 컴포넌트 가져오기
import ScrollToTopButton from "./common/ScrollToTopButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ScrollToTop /> {/* 페이지 이동 시 스크롤 상단으로 이동 */}
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollToTopButton /> {/* 스크롤 버튼 */}
    </>
  );
};

export default Layout;
