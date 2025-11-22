import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Registerpage.jsx"
import Login from "./pages/loginpage.jsx"; 
import Homepage from "./pages/homepage.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import SellPage from "./pages/SellPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import { SocketProvider } from "./context/SocketContext.jsx"
import ChatRoom from "./components/ChatRoom.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/chat" element={
          <SocketProvider>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
              <ChatRoom />
            </div>
          </SocketProvider>
        }/>
        <Route path="/chat/:conversationId" element={
          <SocketProvider>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
              <ChatRoom />
            </div>
          </SocketProvider>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
