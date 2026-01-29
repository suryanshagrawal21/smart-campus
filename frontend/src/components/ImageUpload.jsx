import React, { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

const ImageUpload = ({ onImageSelect, preview, onRemove }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    return (
        <div className="relative">
            {preview ? (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full 
                     opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <FiX />
                    </button>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                >
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center space-y-3"
                    >
                        <div className="bg-blue-100 p-4 rounded-full">
                            <FiUpload className="text-blue-600 text-3xl" />
                        </div>
                        <div>
                            <p className="text-gray-200 font-medium">
                                Drop an image here or click to browse
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                PNG, JPG, GIF up to 5MB
                            </p>
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
