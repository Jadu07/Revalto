import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RevaltoLogoIcon from "@/assets/RevaltoLogo";
import Navbar from "@/components/Common/Navbar";

export default function SellPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUserName(u?.userName || u?.name || "");
      } catch (_) {
      }
    }
  }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Top bar */}
      <div><Navbar /></div>
      

      {/* Content - Add krne ke liye products to sell */}
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="text-center ">
          <h1 className="font-poppins text-xs sm:text-lg font-semibold text-gray-800 mb-10 pb-10">
            Turn your unused items into cash — start selling now!

          </h1>

          <button
            onClick={() => navigate("/add-product")}
            className="font-poppins mx-auto inline-flex items-center justify-center rounded-lg bg-blue-700 hover:bg-green-500 text-white px-10 py-2 text-sm font-semibold shadow "
          >
            Add Now
          </button>

          <div className="my-8 border-t border-gray-300/70" />

          <p className="text-gray-500 py-20">Looks empty! Time to sell your first product!</p>
        </div>
      </div>
    </div>
  );
}

 