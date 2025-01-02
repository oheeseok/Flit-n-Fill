import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage.tsx";
import Fridge from "./pages/fridge/Fridge";
import FridgeRegister from "./pages/fridge/FridgeRegister";
import Recipe from "./pages/recipe/Recipe";
import Community from "./pages/community/Community";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ScrollToTop from "./components/common/ScrollToTop";
import CommunityRegister from "./pages/community/CommunityRegister";
import CommunityList from "./pages/community/CommunityList";
import CommunityEdit from "./pages/community/CommunityEdit";
import CommunityDetail from "./pages/community/CommunityDetail";
import ChatRoomList from "./pages/community/ChatRoomList";
import ChatRoom from "./pages/community/ChatRoom";
import ChatRoomAfter from "./pages/community/ChatRoomAfter";
import RecipeRegister from "./pages/recipe/RecipeRegister";
import RecipeList from "./pages/recipe/RecipeList";
import RecipeDetail from "./pages/recipe/RecipeDetail";
import RecipeEdit from "./pages/recipe/RecipeEdit";
import { GlobalProvider } from "./context/GlobalProvider";
import Layout from "./components/Layout";
import "./App.css";
import AdminPage from "./pages/admin/AdminPage"; // AdminPage 컴포넌트 임포트
import { AdminProvider } from "./context/AdminProvider"; // 새로 만든 AdminProvider 가져오기
import AdminLayout from "./components/AdminLayout"; // AdminLayout (관리자 전용 레이아웃)
// import PushNotification from "./components/PushNotification.tsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalProvider>
        {/* <PushNotification /> */}
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          {/* /home 경로 추가 */}
          {/* <Route
            path="/home"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          /> */}

          {/* 로그인한 사용자 전용 홈 경로 */}
          {/* <Route
            path="/signinhome"
            element={
              <Layout>
                <SignInHome /> 
              </Layout>
            }
          /> */}

          {/* AdminProvider로 감싸기 */}
          <Route
            path="/adminPage"
            element={
              <AdminProvider>
                <AdminLayout>
                  <AdminPage />
                </AdminLayout>
              </AdminProvider>
            }
          />

          <Route
            path="/mypage"
            element={
              <Layout>
                <MyPage />
              </Layout>
            }
          />
          <Route
            path="/fridge"
            element={
              <Layout>
                <Fridge />
              </Layout>
            }
          />
          <Route
            path="/fridge/register"
            element={
              <Layout>
                <FridgeRegister />
              </Layout>
            }
          />
          <Route
            path="/recipe"
            element={
              <Layout>
                <Recipe />
              </Layout>
            }
          />
          <Route
            path="/recipe/register"
            element={
              <Layout>
                <RecipeRegister />
              </Layout>
            }
          ></Route>
          <Route
            path="/recipe/detail/:id"
            element={
              <Layout>
                <RecipeDetail />
              </Layout>
            }
          ></Route>
          <Route
            path="/recipe/list"
            element={
              <Layout>
                <RecipeList />
              </Layout>
            }
          ></Route>
          <Route
            path="recipe/edit/:id"
            element={
              <Layout>
                <RecipeEdit></RecipeEdit>
              </Layout>
            }
          ></Route>
          <Route
            path="/community"
            element={
              <Layout>
                <Community />
              </Layout>
            }
          />
          <Route
            path="/community/register"
            element={
              <Layout>
                <CommunityRegister />
              </Layout>
            }
          ></Route>
          <Route
            path="/community/list"
            element={
              <Layout>
                <CommunityList />
              </Layout>
            }
          ></Route>
          <Route
            path="/community/edit"
            element={
              <Layout>
                <CommunityEdit />
              </Layout>
            }
          ></Route>
          <Route
            path="/community/detail"
            element={
              <Layout>
                <CommunityDetail />
              </Layout>
            }
          ></Route>
          <Route
            path="/chatroomlist"
            element={
              <Layout>
                <ChatRoomList />
              </Layout>
            }
          />
          <Route
            path="/chatroom/:tradeRoomId"
            element={
              <Layout>
                <ChatRoom />
              </Layout>
            }
          />
          <Route
            path="/feedback/:tradeRoomId"
            element={
              <Layout>
                <ChatRoomAfter />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          <Route
            path="/signin"
            element={
              <Layout>
                <SignIn />
              </Layout>
            }
          />
          {/* <Route
            path="/signinhome"
            element={
              <Layout>
                <SignInHome />
              </Layout>
            }
          /> */}
          <Route
            path="/signup"
            element={
              <Layout>
                <SignUp />
              </Layout>
            }
          />
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
