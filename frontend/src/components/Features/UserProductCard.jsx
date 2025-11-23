import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

export default function UserProductCard({ product }) {
  const navigate = useNavigate();
  const discount = Math.round(((product.originalPrice - product.secondHandPrice) / product.originalPrice) * 100);

  const handleCardClick = () => navigate(`/product/${product.id}`);
  const handleEditClick = () => navigate(`/edit-product/${product.id}`);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#e0e7ff]">
      <div onClick={handleCardClick} className="cursor-pointer">
        <div className="aspect-square bg-gray-100">
          <img src={product.itemImgUrl} alt={product.itemName} className="w-full h-full object-cover" />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 truncate">{product.itemName}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-10">{product.description}</p>

          <div className="flex items-center gap-3 mb-">
            <span className="text-2xl font-bold text-gray-900">₹{product.secondHandPrice}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
            {discount > 0 && <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{discount}% OFF</span>}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button onClick={handleEditClick} className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg">
          <Edit size={18} />
          <span className="text-sm">Edit</span>
        </button>
      </div>
    </div>
  );
}
