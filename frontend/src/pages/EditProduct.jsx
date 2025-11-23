import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "@/Services/api"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/Common/Navbar"
import { ImagePlus, User, UserX, Check, Loader2, ArrowRight, X } from "lucide-react"

const CONDITIONS = {
  NEW: "New", LIKE_NEW: "Like New", GOOD: "Good", FAIR: "Fair", POOR: "Poor"
}

const WARRANTIES = {
  NO_WARRANTY: "No Warranty",
  LESS_THAN_1_MONTH: "< 1 Month",
  ONE_TO_THREE_MONTHS: "1 to 3 Months",
  THREE_TO_SIX_MONTHS: "3 to 6 Months",
  SIX_TO_NINE_MONTHS: "6 to 9 Months",
  NINE_TO_TWELVE_MONTHS: "9 to 12 Months",
  MORE_THAN_1_YEAR: "> 1 Year"
}

const CATEGORIES = ["Electronics", "Fashion", "Beauty", "Food", "Accessories"]

export default function EditProduct() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const [load, setLoad] = useState(false)
  const [fetchLoad, setFetchLoad] = useState(true)
  const [img, setImg] = useState("")
  const [data, setData] = useState({
    itemName: "", description: "", originalPrice: "", secondHandPrice: "",
    condition: "GOOD", warrantyRemaining: "NO_WARRANTY", category: "Electronics",
    isPostedAnonymously: false, isAvailable: true
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/posts/id/${id}`);
        const product = response.data;
        
        if (product.authorId !== user?.id) {
          alert("You can only edit your own products")
          nav("/sell")
          return
        }

        setData({
          itemName: product.itemName,
          description: product.description,
          originalPrice: product.originalPrice.toString(),
          secondHandPrice: product.secondHandPrice.toString(),
          condition: product.condition,
          warrantyRemaining: product.warrantyRemaining,
          category: product.category,
          isPostedAnonymously: product.isPostedAnonymously,
          isAvailable: product.isAvailable
        })
        setImg(product.itemImgUrl)
      } catch (err) {
        alert("Failed to load product")
        nav("/sell")
      } finally {
        setFetchLoad(false)
      }
    }

    if (user) {
      fetchProduct()
    }
  }, [id, user, nav])

  useEffect(() => {
    const s = document.createElement("script")
    s.src = "https://upload-widget.cloudinary.com/global/all.js"
    s.async = true
    document.body.appendChild(s)
    return () => document.body.removeChild(s)
  }, [])

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
            {setImg(res.info.secure_url)}
      }).open()
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!img || !user) return alert(!img ? "Please upload an image" : "Please login to edit the post")
    
    setLoad(true)
    try {
      await api.put(`/posts/update/${id}`, { 
        ...data, 
        originalPrice: parseInt(data.originalPrice),
        secondHandPrice: parseInt(data.secondHandPrice),
        itemImgUrl: img, 
        authorId: user.id,
        isAvailable: data.isAvailable
      })
      alert("Product updated successfully!")
      nav("/sell")
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update post")
    } finally {
      setLoad(false)
    }
  }

  if (fetchLoad) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">Edit Your Product</h1>
          <p className="text-gray-500 text-sm">Update your product details</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <form onSubmit={submit} className="p-6 sm:p-10 space-y-10">
            <div>
              {img ? (
                <div className="relative group">
                  <img src={img} alt="Preview" className="w-full h-96 object-cover rounded-2xl"/>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <button type="button" onClick={openUpload} className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-medium shadow-lg transition-all transform hover:scale-105">Change Image</button>
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
            <div><label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">Availability</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="button" onClick={() => setData(p => ({...p, isAvailable: true}))} className={`p-3 rounded-xl border-2 transition ${data.isAvailable ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold text-sm">In Stock</span>
                  </div>
                </button>
                <button type="button" onClick={() => setData(p => ({...p, isAvailable: false}))} className={`p-3 rounded-xl border-2 transition ${!data.isAvailable ? 'border-red-600 bg-red-600 text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5" />
                    <span className="font-semibold text-sm">Sold Out</span>
                  </div>
                </button>
              </div>
            </div>
            <div><label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">Privacy</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="button" onClick={() => setData(p => ({...p, isPostedAnonymously: false}))} className={`p-3 rounded-xl border-2 transition ${!data.isPostedAnonymously ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-semibold text-sm">Public</span>
                  </div>
                </button>
                <button type="button" onClick={() => setData(p => ({...p, isPostedAnonymously: true}))} className={`p-3 rounded-xl border-2 transition ${data.isPostedAnonymously ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-2">
                    <UserX className="w-5 h-5" />
                    <span className="font-semibold text-sm">Anonymous</span>
                  </div>
                </button>
              </div>
            </div>
            <Button type="submit" disabled={load} className="w-full h-14 text-base font-semibold text-white bg-linear-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 rounded-xl shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl hover:shadow-gray-900/30 hover:scale-[1.02] active:scale-[0.98]">
              {load ? <span className="flex items-center justify-center gap-2 text-white"><Loader2 className="animate-spin h-5 w-5 text-white" />Updating...</span> : <span className="flex items-center justify-center gap-2 text-white">Update Product<ArrowRight className="w-5 h-5 text-white" /></span>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
