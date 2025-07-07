import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeroSection from "./components/Home/HomePage";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import LoginForm from "./components/Users/Login";
import { useSelector } from "react-redux";
import RegistrationForm from "./components/Users/Register";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import { getUserFromStorage } from "./utils/getUserFromStorage";
import AddCategory from "./components/Category/AddCategory";
import CategoriesList from "./components/Category/CategoriesList";

function App() {
  const user = useSelector((state) => state?.auth?.user);
  console.log(user);
  return (
    <BrowserRouter>
      {/*navebar*/}

      {user ? <PrivateNavbar /> : <PublicNavbar />}
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/categories" element={<CategoriesList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
