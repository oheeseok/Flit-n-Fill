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
// import SseTest from "./pages/SseTest.tsx";
import PrivateRoute from "./route/PrivateRoute.tsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

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
              <PrivateRoute allowedPages={["mypage"]}>
                <Layout>
                  <MyPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/fridge"
            element={
              <PrivateRoute allowedPages={["fridge"]}>
                <Layout>
                  <Fridge />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/fridge/register"
            element={
              <PrivateRoute allowedPages={["fridge"]}>
                <Layout>
                  <FridgeRegister />
                </Layout>
              </PrivateRoute>
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
              <PrivateRoute allowedPages={["community"]}>
                <Layout>
                  <Community />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/community/register"
            element={
              <PrivateRoute allowedPages={["community"]}>
              <Layout>
                <CommunityRegister />
              </Layout>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/community/list"
            element={
              <PrivateRoute allowedPages={["community"]}>
              <Layout>
                <CommunityList filter=""/>
              </Layout>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/community/edit/:postId"
            element={
              <PrivateRoute allowedPages={["community"]}>
              <Layout>
                <CommunityEdit />
              </Layout>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/community/detail/:postId"
            element={
              <PrivateRoute allowedPages={["community"]}>
              <Layout>
                <CommunityDetail />
              </Layout>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/chatroomlist"
            element={
              <PrivateRoute allowedPages={["community"]}>
              <Layout>
                <ChatRoomList />
              </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/chatroom/:tradeRoomId"
            element={
              <PrivateRoute allowedPages={["community"]}>
              <Layout>
                <ChatRoom />
              </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback/:tradeRoomId"
            element={
              <PrivateRoute allowedPages={["community"]}>
              <Layout>
                <ChatRoomAfter />
              </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute allowedPages={["cart"]}>
                <Layout>
                  <Cart />
                </Layout>
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/sse"
            element={
              <Layout>
                <SseTest />
              </Layout>
            }
          /> */}
          <Route
            path="/signin"
            element={
              <Layout>
                <SignIn />
              </Layout>
            }
          />
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
