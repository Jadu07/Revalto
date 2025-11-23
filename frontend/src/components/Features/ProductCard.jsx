import { useState, useEffect } from "react";
import { api } from "@/Services/api";
import SingleProductCard from "./SingleProductCard";
import { Loader2 } from "lucide-react";

export default function Posts({ activeCategory = "All" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadPosts(1, true);
  }, [activeCategory]);

  const loadPosts = async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const limit = 20;
      const url = activeCategory === "All"
        ? `/posts?page=${pageNum}&limit=${limit}`
        : `/posts?category=${activeCategory}&page=${pageNum}&limit=${limit}`;
      
      const response = await api.get(url);
      const newPosts = response.data;

      if (newPosts.length < limit) {
        setHasMore(false);
      }

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage, false);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-gray-500 py-10">No products found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">Recent Products</h2>
      <div class="h-px bg-gray-400 w-2/5 p-1 mb-5"></div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {posts.map(post => (
          <SingleProductCard key={post.id} product={post} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

