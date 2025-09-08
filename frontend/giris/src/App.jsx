import React from "react";
import "./anasayfa.css"
import LoginForm from "./login.jsx";
import Anasayfa from "./anasayfa.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./register.jsx";
import Sifredegistir from "./sifredegistir.jsx";
import Brands from "./brands.jsx";
import "./brands.css"
import DevicePage from "./DevicePage.jsx";
import "./deviceCard.css"

import Basket from "./basket.jsx";
import Order from "./order.jsx";
import "./order.css"
import Favorites from "./favorites.jsx";
import MyOrders from "./MyOrders.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/sifredegistir" element={<Sifredegistir />} />

        {/* Artık PrivateRoute yok */}
        <Route path="/anasayfa" element={<Anasayfa />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/brand/:brandid" element={<DevicePage />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/order" element={<Order />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/myOrders" element={<MyOrders />} />
      </Routes>
    </Router>
  );
}

export default App;

 


