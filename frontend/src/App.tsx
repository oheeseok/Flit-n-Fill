import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Fridge from "./pages/fridge/Fridge";
import FridgeResister from "./pages/fridge/FridgeResister";
import Recipe from "./pages/recipe/Recipe";
import Community from "./pages/community/Community";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ScrollToTop from "./components/common/ScrollToTop";
import CommunityResister from "./pages/community/CommunityResister";
import CommunityList from "./pages/community/CommunityList";
import RecipeResister from "./pages/recipe/RecipeResister";
import RecipeList from "./pages/recipe/RecipeList";
import RecipeDetail from "./pages/recipe/RecipeDetail";
import { GlobalProvider } from "./context/GlobalProvider";
import Layout from "./components/Layout";
import "./App.css";

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
          <Route
            path="/fridge"
            element={
              <Layout>
                <Fridge />
              </Layout>
            }
          />
          <Route
            path="/fridge/resister"
            element={
              <Layout>
                <FridgeResister />
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
            path="/recipe/resister"
            element={
              <Layout>
                <RecipeResister />
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
            path="/community"
            element={
              <Layout>
                <Community />
              </Layout>
            }
          />
          <Route
            path="/community/resister"
            element={
              <Layout>
                <CommunityResister />
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
