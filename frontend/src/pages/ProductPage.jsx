import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Navbar from "@/components/Common/Navbar";
import { api } from "@/Services/api";
import { useAuth } from "@/context/AuthContext";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const { user } = useAuth();

  const handleContact = async() => {
    try{
      const res = await api.post("/conversations",{
        postId : product.id
      })
      console.log(res)
      navigate(`/chat/${res.data.id}`)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    api.get(`/posts/id/${id}`).then(res => setProduct(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading || !product) return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500 py-20">Loading product...</div>
      </div>
    </div>
  );

  const { author, itemImgUrl, itemName, category, isAvailable, createdAt, secondHandPrice, originalPrice, condition, warrantyRemaining, description, isPostedAnonymously } = product;
  const discount = Math.round(((originalPrice - secondHandPrice) / originalPrice) * 100);
  const displayName = isPostedAnonymously ? "Anonymous" : (author.name || author.userName);
  const displayUsername = isPostedAnonymously ? `anon${author.id}` : author.userName;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 flex items-center justify-center bg-gray-100">
            <img src={itemImgUrl} alt={itemName} className="w-full h-auto max-h-[600px] object-contain rounded-lg" />
          </div>
          <div className="p-8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Category / {category}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {isAvailable ? "AVAILABLE" : "SOLD"}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{itemName}</h1>
            <p className="text-sm text-gray-500 mb-6">Posted on {new Date(createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</p>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-gray-900">₹{secondHandPrice.toFixed(2)}</span>
                <span className="text-xl text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">{discount}% OFF</span>
              </div>
            </div>
            <div className="flex gap-6 mb-8">
              <div className="border border-gray-300 rounded-lg px-6 py-3 flex-1">
                <p className="text-sm text-gray-500 mb-1">Condition</p>
                <p className="text-lg font-bold text-gray-900 mb-1">{condition==="NEW"?"New":condition==="LIKE_NEW"?"Like New":condition==="GOOD"?"Good":condition==="FAIR"?"Fair":condition==="POOR"?"Poor":condition}</p>
              </div>
              <div className="border border-gray-300 rounded-lg px-6 py-3 flex-1">
                <p className="text-sm text-gray-500 mb-1">Warranty</p>
                <p className="text-lg font-bold text-gray-900 mb-1 ">{warrantyRemaining==="NO_WARRANTY"?"No":warrantyRemaining==="LESS_THAN_1_MONTH"?"< 1 Month":warrantyRemaining==="ONE_TO_THREE_MONTHS"?"1-3 Months":warrantyRemaining==="THREE_TO_SIX_MONTHS"?"3-6 Months":warrantyRemaining==="SIX_TO_NINE_MONTHS"?"6-9 Months":warrantyRemaining==="NINE_TO_TWELVE_MONTHS"?"9-12 Months":warrantyRemaining==="MORE_THAN_1_YEAR"?"> 1 Year":warrantyRemaining}</p>
              </div>
            </div>
            
            <div className="mb-0">
              <h3 className="  text-gray-900 mb-3 ">Description</h3>
              <hr className="border-gray-200 my-6" />

              <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-0">{description}</p>
            </div>
            <hr className="border-gray-200 my-6" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                  {!isPostedAnonymously && author.imgUrl?<img src={author.imgUrl} alt={displayName} className="w-full h-full object-cover" />:<span className="text-gray-600 font-semibold text-lg">{displayName.charAt(0).toUpperCase()}</span>}
                </div>
                <div className="flex flex-col justify-center -space-y-1">
                  <p className="font-bold mt-2 mb-0 text-gray-900 text-base">{displayName}</p>
                  <p className="text-sm text-gray-500">@{displayUsername}</p>
                </div>
              </div>
              <button onClick={handleContact} disabled={product.authorId==user.id} className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70">CONTACT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
