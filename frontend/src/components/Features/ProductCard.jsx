import { useState, useEffect } from "react";
import { api } from "@/Services/api";

export default function Posts({ activeCategory = "All" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, activeCategory, true);
  }, [activeCategory]);

  const fetchPosts = async (pageNumber, category, isNewCategory = false) => {
    setLoading(true);
    try {
      const limit = 1;
      const endpoint =
        category === "All"
          ? `/posts?page=${pageNumber}&limit=${limit}`
          : `/posts?category=${category}&page=${pageNumber}&limit=${limit}`;
      
      const response = await api.get(endpoint);
      const newPosts = response.data;

      if (newPosts.length < limit) {
        setHasMore(false); 
      }

      if (isNewCategory) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]); 
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, activeCategory);
  };


  if (loading && posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-gray-500 py-10">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                <img src={post.itemImgUrl} alt={post.itemName} className="w-full h-48 object-cover rounded-lg mb-3" />
                <h3 className="font-semibold text-gray-800 text-lg truncate">{post.itemName}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-500 text-sm line-through">₹{post.originalPrice}</span>
                  <span className="text-blue-600 font-semibold">₹{post.secondHandPrice}</span>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && <div className="text-center text-gray-500 py-10">No posts found.</div>
      )}
    </div>
  );
}

