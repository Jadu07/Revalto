import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PackageOpen, Loader2 } from "lucide-react";
import Navbar from "@/components/Common/Navbar";
import UserProductCard from "@/components/Features/UserProductCard";
import { api } from "@/Services/api";
import { useAuth } from "@/context/AuthContext";

export default function SellPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user?.id) {
      fetchUserProducts()};
  }, [user, navigate]);

  const fetchUserProducts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/posts/author/${user.id}`);
      setProducts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
    setLoading(false);
  };

const productGrid = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <UserProductCard key={product.id} product={product} />
      ))}
    </div>
  );

const noProducts = (
    <div className="flex flex-col items-center py-20">
      <PackageOpen size={64} className="text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products</h3>
      <p className="text-gray-500">Add your first product</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Products</h1>
            <p className="text-gray-600">Turn your unused items into cash — start selling now!</p>
          </div>
          
          <button onClick={() => navigate("/add-product")} className="flex items-center gap-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 font-semibold">
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        <hr className="pb-6"/>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={48} className="text-gray-400 animate-spin" />
          </div>
        ) : products.length > 0 ? productGrid : noProducts}
      </div>
    </div>
  );
}

 