import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { CookiesProvider } from "react-cookie";

import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import CarAddNew from "./pages/CarAddNew";
import CarEdit from "./pages/CarEdit";
import Rent from "./pages/Rent";
import RentalDate from "./pages/RentalDate";
import Checkout from "./pages/CheckOut";
import Categories from "./pages/Categories";
import CategoryEdit from "./pages/CategoryEdit";
import DashBoard from "./pages/DashBoard";
import DashBoardEdit from "./pages/DashBoardEdit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PaymentVerify from "./pages/PaymentVerify";

function App() {
  return (
    <div className="App">
      {" "}
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/caraddnew" element={<CarAddNew />} />
            <Route path="/caredit/:id" element={<CarEdit />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/rentaldate/:id" element={<RentalDate />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categoryedit/:id" element={<CategoryEdit />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/dashboardedit/:id" element={<DashBoardEdit />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-payment" element={<PaymentVerify />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </CookiesProvider>
    </div>
  );
}

export default App;
