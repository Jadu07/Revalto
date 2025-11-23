import { useNavigate } from "react-router-dom";

export default function SingleProductCard({ product }) {
  const navigate = useNavigate();
  const discount = Math.round(((product.originalPrice - product.secondHandPrice) / product.originalPrice) * 100);
  const isSold = !product.isAvailable;

  return (
    <div onClick={() => navigate(`/product/${product.id}`)} className="bg-white rounded-xl overflow-hidden shadow-md border border-[#e0e7ff] cursor-pointer relative">
      <div className="aspect-square bg-gray-100 relative">
        <img src={product.itemImgUrl} alt={product.itemName} className={`w-full h-full object-cover ${isSold ? 'opacity-50' : ''}`} />
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-white text-3xl font-bold">SOLD</span>
          </div>
        )}
      </div>
      
      <div className={`p-4 ${isSold ? 'opacity-60' : ''}`}>
        <h3 className="font-semibold text-gray-900 text-lg mb-2 truncate">{product.itemName}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-10">{product.description}</p>
        
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">₹{product.secondHandPrice}</span>
          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          {discount > 0 && <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{discount}% OFF</span>}
        </div>
      </div>
    </div>
  );
}
