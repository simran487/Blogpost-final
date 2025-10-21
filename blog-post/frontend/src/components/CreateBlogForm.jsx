// src/components/CreateBlogForm.jsx
import React, { useState, useCallback, useEffect } from "react";
import { X, Upload, RotateCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from "../config/constants";

// Helper component for form inputs
const InputField = ({ label, id, type = 'text', value, onChange, disabled, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {type === 'textarea' ? (
            <textarea
                id={id}
                name={id}
                rows="4"
                required={required}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
            ></textarea>
        ) : (
            <input
                id={id}
                name={id}
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
            />
        )}
    </div>
);

const CreateBlogForm = ({ onClose, onSuccess, initialData }) => {
    const { token, isAuthenticated } = useAuth();
    const isEditing = !!initialData;

    // --- State Management ---
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // 💡 NEW: State for status messages (success/error)
    const [status, setStatus] = useState({ type: '', message: '' }); 
    const [removeImage, setRemoveImage] = useState(false); // State for explicit image removal

    // 💡 NEW: Authorization check for component mount
    useEffect(() => {
        if (!isAuthenticated) { 
            // Inform user via console and close the form.
            console.warn("User is not authenticated. Redirecting to home/closing form.");
            onClose();
        }
    }, [isAuthenticated, onClose]);


    // --- Handlers ---
    const handleFileChange = useCallback((e) => {
        setImageFile(e.target.files[0]);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' }); // Clear previous status
        
        if (!isAuthenticated || !token) {
            // 💡 UPDATED: Use status state instead of alert
            setStatus({ type: 'error', message: 'You are not logged in or your session has expired. Please sign in.' });
            return;
        }

        setIsSubmitting(true);

        // 1. Build FormData
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('content', content);
    //    / Always append removeImage flag
    
        // Only append imageFile if it's a new file
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        // Append removeImage flag only during editing
        if (isEditing) {
            formData.append('removeImage', removeImage);
            // Add the current image URL if not removing and not uploading a new image
            if (!removeImage && !imageFile && initialData.imageUrl) {
                formData.append('image_url', initialData.imageUrl);
            }
        }

        // 2. Setup Request
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
     
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_BASE_URL}/blogs/${initialData.id}` : `${API_BASE_URL}/blogs`;
        
        try {
            const response = await fetch(url, {
                method: method, 
                headers: headers,
                body: formData,
            });

      console.log('Submission response status:', response);
            if (response.status === 403) {
                throw new Error("You are not authorized to edit this blog post.");
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown API Error' }));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            // Success!
            setStatus({ type: 'success', message: `Blog post successfully ${isEditing ? 'updated' : 'created'}!` });
            
            // Wait a moment for UX before closing and refreshing
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);

        } catch (error) {
            console.error('Submission error:', error);
            setStatus({ 
                type: 'error', 
                message: `Failed to ${isEditing ? 'save changes' : 'create post'}: ${error.message}` 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render ---
    return (
        // Modal Overlay
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300">
            {/* Modal Content */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                
                {/* Header and Close Button */}
                <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Status Message Area */}
                {status.message && (
                    <div className={`m-6 p-4 rounded-lg text-sm ${
                        status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`} role="alert">
                        {status.message}
                    </div>
                )}

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <InputField 
                        label="Title" 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        disabled={isSubmitting}
                    />

                    <InputField 
                        label="Description (Short Summary)" 
                        id="description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        disabled={isSubmitting}
                        required={false}
                    />

                    <InputField 
                        label="Content" 
                        id="content" 
                        type="textarea" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        disabled={isSubmitting}
                    />
                    
                    {/* Image Handling Section */}
                    <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700">
                            Blog Image
                        </label>
                        
                        {/* Image Upload Input */}
                        <div className="flex items-center space-x-4">
                            <input
                                id="imageFile"
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isSubmitting}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition disabled:opacity-50"
                            />
                            <Upload className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Current Image Display and Removal Option (Only in Edit Mode) */}
                        {isEditing && initialData.imageUrl && (
                            <div className="flex items-center justify-between mt-3 p-3 bg-white border rounded-lg">
                                <span className={`text-sm ${removeImage ? 'line-through text-red-500' : 'text-gray-600'}`}>
                                    Current Image: {initialData.imageUrl.substring(initialData.imageUrl.lastIndexOf('/') + 1)}
                                </span>
                                <label className="flex items-center space-x-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={removeImage}
                                        onChange={(e) => setRemoveImage(e.target.checked)}
                                        disabled={isSubmitting || !!imageFile}
                                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50"
                                    />
                                    <span>Remove Image</span>
                                </label>
                            </div>
                        )}
                        {/* Display preview of newly selected file */}
                        {imageFile && (
                             <p className="text-xs text-green-600 mt-2">New file selected: {imageFile.name}</p>
                        )}
                    </div>
                    
                    {/* Submission Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white transition duration-200 ${
                                isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {isSubmitting ? (
                                <><RotateCw className="w-5 h-5 mr-2 animate-spin" /> {isEditing ? 'Saving...' : 'Creating...'}</>
                            ) : (
                                isEditing ? 'Save Changes' : 'Create Post'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlogForm;
