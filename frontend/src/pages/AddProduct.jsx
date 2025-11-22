import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/Services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Common/Navbar";
import { ImagePlus, User, UserX, Check, Loader2, ArrowRight } from "lucide-react";

const INIT_STATE = {
  itemName: "", description: "", originalPrice: "", secondHandPrice: "",
  condition: "GOOD", warrantyRemaining: "NO_WARRANTY", category: "Electronics",
  isPostedAnonymously: false
};

const CONDITIONS = {
  NEW: "New", LIKE_NEW: "Like New", GOOD: "Good", FAIR: "Fair", POOR: "Poor"
};

const WARRANTIES = {
  NO_WARRANTY: "No Warranty",
  LESS_THAN_1_MONTH: "< 1 Month",
  ONE_TO_THREE_MONTHS: "1 to 3 Months",
  THREE_TO_SIX_MONTHS: "3 to 6 Months",
  SIX_TO_NINE_MONTHS: "6 to 9 Months",
  NINE_TO_TWELVE_MONTHS: "9 to 12 Months",
  MORE_THAN_1_YEAR: "> 1 Year"
};

const CATEGORIES = ["Electronics", "Fashion", "Beauty", "Food", "Accessories"];

export default function AddProduct() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [load, setLoad] = useState(false);
  const [img, setImg] = useState("");
  const [data, setData] = useState(INIT_STATE);

//   cloudnary widget setup
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://upload-widget.cloudinary.com/global/all.js";
    s.async = true;
    document.body.appendChild(s);
    return () => document.body.removeChild(s);
  }, []);
// cloudnary widget popup
  const openUpload = () => {
    if (window.cloudinary) {
      window.cloudinary.createUploadWidget({
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url", "camera"], 
        multiple: false, 
        maxFiles: 1,
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        croppingCoordinatesMode: "custom"
      }, (err, res) => {
        if (!err && res?.event === "success") 
            {setImg(res.info.secure_url)};
      }).open();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!img || !user) return alert(!img ? "Please upload an image" : "Please login to create a post");
    
    setLoad(true);
    try {
      await api.post("/posts/create", { 
        ...data, 
        originalPrice: parseInt(data.originalPrice),
        secondHandPrice: parseInt(data.secondHandPrice),
        itemImgUrl: img, 
        authorId: user.id 
      });
      alert("Product added successfully!");
      nav("/sell");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">List Your Product</h1>
          <p className="text-gray-500 text-sm">Share what you're selling with the community</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <form onSubmit={submit} className="p-6 sm:p-10 space-y-10">
            <div>
              {img ? (
                <div className="relative group">
                  <img src={img} alt="Preview" className="w-full h-96 object-cover rounded-2xl"/>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <button type="button" onClick={() => setImg("")} className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-medium shadow-lg transition-all transform hover:scale-105">Change Image</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={openUpload} className="w-full h-96 border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50/50 transition-all flex flex-col items-center justify-center gap-4 group">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-900">Upload product image</p>

                    <p className="text-sm text-gray-500 mt-1">PNG, JPG or GIF (max. 10MB)</p>


                  </div>
                  
                </button>
              )}

            </div>
            <div className="space-y-6">
              <div>
                <Input name="itemName" value={data.itemName} onChange={(e) => setData(p => ({ ...p, itemName: e.target.value }))} placeholder="Product name" className="h-14 text-base border-gray-200 focus:border-gray-900 rounded-xl" required/>
              </div>
              <div>
                <textarea name="description" value={data.description} onChange={(e) => setData(p => ({ ...p, description: e.target.value }))} placeholder="Write a detailed description of your product, including key features, usage, materials, size, and any special qualities that make it stand out." className="w-full p-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none min-h-[140px] resize-none" required minLength={10}/>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div><label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">Original Price</label><Input name="originalPrice" type="number" value={data.originalPrice} onChange={(e) => setData(p => ({ ...p, originalPrice: e.target.value }))} placeholder="₹2999" className="pl-11 h-14 text-base border-gray-200 focus:border-gray-900 rounded-xl" required min="0" step="1"/></div>
              <div><label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">Selling Price</label><Input name="secondHandPrice" type="number" value={data.secondHandPrice} onChange={(e) => setData(p => ({ ...p, secondHandPrice: e.target.value }))} placeholder="₹1999" className="pl-11 h-14 text-base border-gray-200 focus:border-gray-900 rounded-xl" required min="0" step="1"/></div>
              <div><label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">Category</label><select name="category" value={data.category} onChange={(e) => setData(p => ({ ...p, category: e.target.value }))} className="w-full h-14 px-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none bg-white">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">Condition</label><select name="condition" value={data.condition} onChange={(e) => setData(p => ({ ...p, condition: e.target.value }))} className="w-full h-14 px-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none bg-white">{Object.entries(CONDITIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
              <div><label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">Warranty</label><select name="warrantyRemaining" value={data.warrantyRemaining} onChange={(e) => setData(p => ({ ...p, warrantyRemaining: e.target.value }))} className="w-full h-14 px-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none bg-white">{Object.entries(WARRANTIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
            </div>
            <div><label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">Privacy</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="button" onClick={() => setData(p => ({...p, isPostedAnonymously: false}))} className={`group relative p-3.5 rounded-xl border-2 transition-all duration-200 ${!data.isPostedAnonymously ? 'border-gray-900 bg-linear-to-br from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/20 scale-[1.02]' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:shadow-md'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${!data.isPostedAnonymously ? 'bg-white/15' : 'bg-gray-50 group-hover:bg-gray-100'}`}><User className="w-5 h-5" /></div>
                    <div className="text-left flex-1 min-w-0"><p className="font-bold text-sm leading-tight mb-1">Public Profile</p><p className={`text-xs leading-tight ${!data.isPostedAnonymously ? 'text-white/70' : 'text-gray-500'}`}>Your name will be visible</p></div>
                    {!data.isPostedAnonymously && <div className="shrink-0 animate-in fade-in duration-200"><div className="w-6 h-6 rounded-full bg-white flex items-center justify-center"><Check className="w-4 h-4 text-gray-900" /></div></div>}
                  </div>
                </button>
                <button type="button" onClick={() => setData(p => ({...p, isPostedAnonymously: true}))} className={`group relative p-3.5 rounded-xl border-2 transition-all duration-200 ${data.isPostedAnonymously ? 'border-gray-900 bg-linear-to-br from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/20 scale-[1.02]' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:shadow-md'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${data.isPostedAnonymously ? 'bg-white/15' : 'bg-gray-50 group-hover:bg-gray-100'}`}><UserX className="w-5 h-5" /></div>
                    <div className="text-left flex-1 min-w-0"><p className="font-bold text-sm leading-tight mb-1">Stay Anonymous</p><p className={`text-xs leading-tight ${data.isPostedAnonymously ? 'text-white/70' : 'text-gray-500'}`}>Keep your identity hidden</p></div>
                    {data.isPostedAnonymously && <div className="shrink-0 animate-in fade-in duration-200"><div className="w-6 h-6 rounded-full bg-white flex items-center justify-center"><Check className="w-4 h-4 text-gray-900" /></div></div>}
                  </div>
                </button>
              </div>
            </div>
            <Button type="submit" disabled={load} className="w-full h-14 text-base font-semibold text-white bg-linear-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 rounded-xl shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl hover:shadow-gray-900/30 hover:scale-[1.02] active:scale-[0.98]">
              {load ? <span className="flex items-center justify-center gap-2 text-white"><Loader2 className="animate-spin h-5 w-5 text-white" />Publishing...</span> : <span className="flex items-center justify-center gap-2 text-white">Publish Product<ArrowRight className="w-5 h-5 text-white" /></span>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
