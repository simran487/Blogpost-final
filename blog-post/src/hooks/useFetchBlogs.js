// src/hooks/useFetchBlogs.js
import { useState, useEffect } from "react";
import { BLOGS_PER_PAGE, BLOGS_API_URL } from "../config/constants"; // 💡 UPDATED import
import { useAuth } from "../context/AuthContext"; // 💡 NEW: Import useAuth

// Now accepts the current page number and the refresh trigger
export const useFetchBlogs = (currentPage, refreshTrigger, postView) => { // Removed 'url' prop
  const { token, userId } = useAuth(); // 💡 NEW: Get the token from the AuthContext
  const [data, setData] = useState({ 
    blogs: [], 
    totalCount: 0, 
    totalPages: 1 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
    // Construct the API URL with pagination query parameters
    let apiUrl;
      
       // 💡 NEW: Conditionally adjust API URL for "My Posts"
        if (postView === "my" && userId) {
          apiUrl = `${BLOGS_API_URL}/user/${userId}?page=${currentPage}&limit=${BLOGS_PER_PAGE}`;
        }else{
          apiUrl = `${BLOGS_API_URL}?page=${currentPage}&limit=${BLOGS_PER_PAGE}`;
        }
        const headers = {};
        // 💡 NEW: Attach Authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(apiUrl, { headers });
        
        if (!response.ok) {
          const errorDetail = await response.json().catch(() => ({ 
            error: `HTTP ${response.status}` 
          }));
          throw new Error(
            `API error: ${errorDetail.error || response.statusText}`);
        }
       

        const json = await response.json();
        
        // --- NEW DATA STRUCTURE MAPPING ---
        const mappedBlogs = json.blogs.map((blog) => ({
          id: blog.id,
          title: blog.title || "Untitled Post",
          description: blog.description || "No description available.",
          content: blog.content,
          name: blog.author_name || "Anonymous", // 💡 NEW: Author's name
          // Fix image URL path by prepending API base URL if it's a relative path
          imageUrl:
            (blog.image_url ? `http://localhost:5000${blog.image_url}` : null) ||
            `https://placehold.co/400x250/3730a3/ffffff?text=${blog.title || "Blog Post"}`,
          category: "User Generated",
          date: blog.created_at
            ? new Date(blog.created_at).toLocaleDateString()
            : "Date Unknown",
          is_owner: blog.is_owner // 💡 NEW: Include the is_owner flag
        }));

        setData({
            blogs: mappedBlogs,
            totalCount: json.pagination?.totalCount || 0,
            totalPages: json.pagination?.totalPages || 1,
        });

      } catch (e) {
        console.error("Fetching error:", e);
        setError(`Failed to load blog posts: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, refreshTrigger, token, postView, userId]); // 💡 ADDED 'token' as a dependency

  return { data, loading, error, setData };
};