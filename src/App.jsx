import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarDefault } from "./components/Navbar";
import { SimpleFooter } from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Reservation from "./pages/Reservation";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NavbarDefault />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order" element={<Order />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <SimpleFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;