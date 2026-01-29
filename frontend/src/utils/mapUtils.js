// Campus map configuration and utilities

// Campus center coordinates
export const CAMPUS_CENTER = {
    lat: 28.797551089294277,
    lng: 77.53732912232692
};

// Default map zoom level
export const DEFAULT_ZOOM = 16;

// Map bounds (approximate campus area)
export const CAMPUS_BOUNDS = {
    north: 28.802,
    south: 28.793,
    east: 77.542,
    west: 77.532
};

// Status to marker color mapping
export const STATUS_COLORS = {
    'Pending': '#f59e0b', // amber
    'In Progress': '#3b82f6', // blue
    'Resolved': '#10b981', // green
    'Rejected': '#ef4444' // red
};

// Category to icon mapping (using emoji for simplicity)
export const CATEGORY_ICONS = {
    'Electricity': '⚡',
    'Water': '💧',
    'Internet': '📶',
    'Cleanliness': '🧹',
    'Infrastructure': '🏗️',
    'Other': '📌'
};

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean}
 */
export const isValidCoordinate = (lat, lng) => {
    return (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {Object} coord1 - First coordinate {lat, lng}
 * @param {Object} coord2 - Second coordinate {lat, lng}
 * @returns {number} Distance in meters
 */
export const calculateDistance = (coord1, coord2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

/**
 * Check if coordinates are within campus bounds
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean}
 */
export const isWithinCampus = (lat, lng) => {
    return (
        lat >= CAMPUS_BOUNDS.south &&
        lat <= CAMPUS_BOUNDS.north &&
        lng >= CAMPUS_BOUNDS.west &&
        lng <= CAMPUS_BOUNDS.east
    );
};

/**
 * Format coordinates for display
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string}
 */
export const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

/**
 * Create custom marker HTML
 * @param {string} status - Issue status
 * @param {string} category - Issue category
 * @returns {string} HTML string for custom marker
 */
export const createMarkerIcon = (status, category) => {
    const color = STATUS_COLORS[status] || STATUS_COLORS['Pending'];
    const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS['Other'];

    return `
        <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <span style="
                transform: rotate(45deg);
                font-size: 16px;
            ">${icon}</span>
        </div>
    `;
};
