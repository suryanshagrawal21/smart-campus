import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiTag, FiFileText, FiSend } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import LocationPicker from '../components/LocationPicker';
import { issueService } from '../services/issueService';

const ReportIssue = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Electricity',
        building: '',
        floor: '',
        room: '',
    });
    const [coordinates, setCoordinates] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const categories = ['Electricity', 'Water', 'Internet', 'Cleanliness', 'Infrastructure', 'Other'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageSelect = (file) => {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);

            const location = {
                building: formData.building,
                floor: formData.floor,
                room: formData.room,
            };

            // Add coordinates if selected
            if (coordinates) {
                location.coordinates = coordinates;
            }

            submitData.append('location', JSON.stringify(location));

            if (image) {
                submitData.append('image', image);
            }

            await issueService.createIssue(submitData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create issue. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="page-container">
                <Navbar />

                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="section-title">Report New Issue</h1>
                        <p className="dark:text-gray-300 text-gray-600">Help us improve campus facilities by reporting issues</p>
                    </div>

                    {/* Form */}
                    <div className="glass-card p-8 animate-slide-up">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-2">
                                    <FiFileText className="inline mr-2" />
                                    Issue Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input-field px-4"
                                    placeholder="e.g., Broken light in classroom"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-2">
                                    <FiTag className="inline mr-2" />
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input-field px-4"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input-field resize-none"
                                    rows={4}
                                    placeholder="Provide detailed information about the issue..."
                                    maxLength={500}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {formData.description.length}/500 characters
                                </p>
                            </div>

                            {/* Location */}
                            <div className="border-t border-gray-200 pt-6">
                                <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-4">
                                    <FiMapPin className="inline mr-2" />
                                    Location Details *
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="building"
                                            value={formData.building}
                                            onChange={handleChange}
                                            className="input-field px-4"
                                            placeholder="Building Name *"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="floor"
                                            value={formData.floor}
                                            onChange={handleChange}
                                            className="input-field px-4"
                                            placeholder="Floor (optional)"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="room"
                                            value={formData.room}
                                            onChange={handleChange}
                                            className="input-field px-4"
                                            placeholder="Room (optional)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Map Location Picker */}
                            <div className="border-t border-gray-200 pt-6">
                                <LocationPicker onLocationSelect={setCoordinates} initialPosition={coordinates} />
                            </div>

                            {/* Image Upload */}
                            <div className="border-t border-gray-200 pt-6">
                                <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-4">
                                    Upload Image (Optional)
                                </label>
                                <ImageUpload
                                    onImageSelect={handleImageSelect}
                                    preview={imagePreview}
                                    onRemove={handleRemoveImage}
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Adding an image helps us understand and resolve the issue faster
                                </p>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex space-x-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        'Submitting...'
                                    ) : (
                                        <>
                                            <FiSend className="inline mr-2" />
                                            Submit Issue
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportIssue;
