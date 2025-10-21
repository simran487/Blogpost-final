// src/components/BlogCard.jsx
import React from "react";
import { Trash2, Pencil } from "lucide-react"; 
import { Link } from "react-router-dom"; 
// import { useAuth } from "../context/AuthContext"; // Not strictly needed if is_owner comes from blog object

const BlogCard = React.memo(({ blog, viewMode, onDelete, onEdit }) => {
  const isGrid = viewMode === "grid";
  // const { isAuthenticated } = useAuth(); // We'll rely on blog.is_owner

  const stopPropagation = (e) => e.stopPropagation();
	console.log('Rendering BlogCard:', blog);
// console.log(blog);
  return (

    <div
      role="article"
      className={`bg-white shadow-xl rounded-xl transition-all duration-300 overflow-hidden hover:shadow-2xl hover:scale-[1.01] flex ${
        isGrid ? "flex-col" : "flex-row"
      } max-w-full relative`}
    >



    <Link 
        to={`/blog/${blog.id}`} 
//         target="_blank" 
//         rel="noopener noreferrer" 
        role="article"
        className={"absolute inset-0 z-0"}
        aria-label={`View ${blog.title}`}
       />

        {/* Image Content */}
        <div className={`${isGrid ? "h-48 w-full" : "h-full w-56"}`}>
            <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
                loading="lazy"
            />
        </div>
        
        {/* Text Content */}
        <div className="p-4 flex flex-col justify-between flex-grow z-10 bg-white">
            <div>
                <h2
                    // 💥 FIX APPLIED HERE: The template literal is consolidated onto one line
                    className={`font-bold text-gray-900 transition-colors duration-200 hover:text-indigo-600 ${isGrid ? 'text-lg line-clamp-2' : 'text-xl line-clamp-1'}`}
                >
        <Link to={`/blog/${blog.id}`} className="relative z-10">{blog.title}</Link>
{/*                     <Link to={`/blog/${blog.id}`}>{blog.title}</Link> */}
                </h2>
                <h3>Author : {blog.name}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{blog.description}</p>
            </div>
            <p className="mt-3 text-xs text-gray-400">Published on {blog.date}</p>
        </div>

        {/* Edit and Delete Buttons Container */}
        {blog.is_owner && (
            <div 
                className={`absolute z-20 flex flex-col space-y-2 ${ 
                    isGrid 
                    ? 'top-2 right-2' 
                    : 'top-1/2 -translate-y-1/2 left-2' 
                }`}
            >
                
                {/* EDIT Button */}
                <button
                    onClick={() => {onEdit(blog)}} 
                    className="p-2 text-white bg-indigo-500 rounded-full transition-colors duration-200 shadow-lg hover:bg-indigo-600"
                    aria-label={`Edit ${blog.title}`}
                >
                 <Pencil className="h-5 w-5" />
                </button>

                {/* DELETE Button */}
                <button
                    onClick={() => {onDelete(blog.id);}} 
                    className="p-2 text-white bg-red-500 rounded-full transition-colors duration-200 shadow-lg hover:bg-red-600"
                    aria-label={`Delete ${blog.title}`}
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        )}
</div>
  );
});

BlogCard.displayName = 'BlogCard';
export default BlogCard;