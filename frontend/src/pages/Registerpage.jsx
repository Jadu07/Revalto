import LoginForm from "@/components/login-form.jsx";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-gray-100 text-gray-900">
      <Navbar />
      
      <div className="grid min-h-[calc(100vh-80px)] w-full grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Form Section */}
        <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 overflow-auto">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
              <LoginForm className="text-gray-900" mode="Sign up"/>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-hidden max-h-[calc(100vh-80px)]">
          <div 
            className="relative w-full h-full max-h-full bg-cover bg-center rounded-lg bg-no-repeat"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            role="img"
            aria-label="Registration background"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-900/60 rounded-lg"></div>
          </div>
        </div>

      </div>
    </div>
  );
}