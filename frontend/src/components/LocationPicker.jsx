import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CAMPUS_CENTER, DEFAULT_ZOOM, formatCoordinates } from '../utils/mapUtils';
import { FiMapPin, FiCheck } from 'react-icons/fi';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icon for location picker
const createPickerIcon = () => {
    return L.divIcon({
        className: 'custom-picker-marker',
        html: `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                width: 40px;
                height: 40px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 4px solid white;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: bounce 0.5s ease-out;
            ">
                <span style="
                    transform: rotate(45deg);
                    color: white;
                    font-size: 20px;
                    line-height: 1;
                ">📍</span>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });
};

/**
 * Map click handler component
 */
const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            });
        },
    });

    return position ? (
        <Marker position={[position.lat, position.lng]} icon={createPickerIcon()} />
    ) : null;
};

/**
 * Location Picker Component - Interactive map for selecting issue location
 */
const LocationPicker = ({ onLocationSelect, initialPosition = null }) => {
    const [position, setPosition] = useState(initialPosition);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handlePositionChange = (newPosition) => {
        setPosition(newPosition);
        setShowConfirmation(true);
        if (onLocationSelect) {
            onLocationSelect(newPosition);
        }
    };

    const handleConfirm = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="space-y-4">
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <FiMapPin className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" size={20} />
                    <div className="text-sm">
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Select Issue Location
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                            Click anywhere on the map to mark the exact location of the issue.
                            This helps us identify and resolve problems more efficiently.
                        </p>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <MapContainer
                    center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]}
                    zoom={DEFAULT_ZOOM}
                    style={{ height: '400px', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={handlePositionChange} />
                </MapContainer>

                {/* Crosshair hint */}
                {!position && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[400]">
                        <div className="bg-white/90 dark:bg-gray-800/90 px-6 py-3 rounded-full shadow-lg">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                👆 Click on the map to select location
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Coordinates Display */}
            {position && (
                <div className="glass-card p-4 animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                <FiCheck className="text-white" size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Location Selected
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                    {formatCoordinates(position.lat, position.lng)}
                                </p>
                            </div>
                        </div>
                        {showConfirmation && (
                            <button
                                onClick={handleConfirm}
                                className="text-sm px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                Confirmed ✓
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Optional: Make location selection optional */}
            {!position && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Location selection is optional but recommended for faster issue resolution
                </p>
            )}
        </div>
    );
};

export default LocationPicker;
