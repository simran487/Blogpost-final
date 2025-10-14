// src/pages/BlogPage.jsx
import React, { useState, useCallback } from "react";
import { LayoutGrid, List, MessageSquarePlus } from "lucide-react";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import CreateBlogForm from "../components/CreateBlogForm";
import { useFetchBlogs } from "../hooks/useFetchBlogs";
import { useAuth } from "../context/AuthContext";
import { BLOGS_API_URL } from "../config/constants";

const BlogPage = () => {
  const { isAuthenticated, token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const {
    data: { blogs, totalCount, totalPages = 1 },
    loading,
    error,
  } = useFetchBlogs(currentPage, refreshTrigger);

  // Handle pagination
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Refresh after success
  const handleSuccess = useCallback(() => {
    setShowForm(false);
    setEditingBlog(null);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Edit handler
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  // Create handler
  const handleCreate = () => {
    if (!isAuthenticated) return alert("Please sign in to create a post.");
    setEditingBlog(null);
    setShowForm(true);
  };

  // Delete handler
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this blog post?"))
        return;

      try {
        const res = await fetch(`${BLOGS_API_URL}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to delete post");
        alert("Blog post deleted!");
        setRefreshTrigger((prev) => prev + 1);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    },
    [token]
  );

  return (
    <>
      <Header totalArticles={totalCount} />

      {/* Modal Form (Create/Edit) */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <CreateBlogForm
            onClose={() => setShowForm(false)}
            onSuccess={handleSuccess}
            initialData={editingBlog}
          />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Controls */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-md">
          <button
            onClick={handleCreate}
            disabled={!isAuthenticated}
            className="px-6 py-3 text-base font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition duration-200 flex items-center space-x-2 disabled:bg-gray-400"
          >
            <MessageSquarePlus className="h-5 w-5" />
            <span>Create New Post</span>
          </button>

          <button
            onClick={() =>
              setViewMode(viewMode === "grid" ? "list" : "grid")
            }
            className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-50 transition duration-200 flex items-center space-x-2"
          >
            {viewMode === "grid" ? (
              <>
                <List className="h-5 w-5" />
                <span>List View</span>
              </>
            ) : (
              <>
                <LayoutGrid className="h-5 w-5" />
                <span>Grid View</span>
              </>
            )}
          </button>
        </div>

        {/* Blog Cards */}
        {loading ? (
          <p className="text-center text-indigo-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : blogs.length > 0 ? (
          <section
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </section>
        ) : (
          <p className="text-center text-gray-500">
            No blogs yet. Create your first post!
          </p>
        )}

        {/* Always show pagination controls */}
        {blogs.length > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      <Footer />
    </>
  );
};

export default BlogPage;
