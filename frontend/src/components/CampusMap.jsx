import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CAMPUS_CENTER, DEFAULT_ZOOM, STATUS_COLORS, CATEGORY_ICONS } from '../utils/mapUtils';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Create custom marker icon based on status
 */
const createCustomIcon = (status, category) => {
    const color = STATUS_COLORS[status] || STATUS_COLORS['Pending'];
    const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS['Other'];

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: ${color};
                width: 36px;
                height: 36px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            " class="marker-pin">
                <span style="
                    transform: rotate(45deg);
                    font-size: 18px;
                    line-height: 1;
                ">${icon}</span>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });
};

/**
 * Map bounds setter component
 */
const SetMapBounds = ({ issues }) => {
    const map = useMap();

    React.useEffect(() => {
        if (issues && issues.length > 0) {
            const validIssues = issues.filter(
                issue => issue.location?.coordinates?.lat && issue.location?.coordinates?.lng
            );

            if (validIssues.length > 0) {
                const bounds = L.latLngBounds(
                    validIssues.map(issue => [
                        issue.location.coordinates.lat,
                        issue.location.coordinates.lng
                    ])
                );
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
            }
        }
    }, [issues, map]);

    return null;
};

/**
 * Campus Map Component - Displays all issues on an interactive map
 */
const CampusMap = ({ issues = [], height = '600px', showClustering = true, autoFitBounds = false }) => {
    const validIssues = issues.filter(
        issue => issue.location?.coordinates?.lat && issue.location?.coordinates?.lng
    );

    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ height }}>
            <MapContainer
                center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {autoFitBounds && <SetMapBounds issues={validIssues} />}

                {showClustering ? (
                    <MarkerClusterGroup
                        chunkedLoading
                        maxClusterRadius={50}
                        spiderfyOnMaxZoom={true}
                        showCoverageOnHover={false}
                        zoomToBoundsOnClick={true}
                    >
                        {validIssues.map((issue) => (
                            <Marker
                                key={issue._id}
                                position={[
                                    issue.location.coordinates.lat,
                                    issue.location.coordinates.lng
                                ]}
                                icon={createCustomIcon(issue.status, issue.category)}
                            >
                                <Popup maxWidth={300} className="custom-popup">
                                    <div className="p-2">
                                        <h3 className="font-bold text-gray-900 mb-2 text-base">
                                            {issue.title}
                                        </h3>

                                        <div className="flex gap-2 mb-2">
                                            <StatusBadge status={issue.status} />
                                            <SeverityBadge severity={issue.severity} />
                                        </div>

                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                            {issue.description}
                                        </p>

                                        <div className="text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="font-semibold">📍</span>
                                                <span>{issue.location.building}</span>
                                                {issue.location.floor && <span>, Floor {issue.location.floor}</span>}
                                                {issue.location.room && <span>, Room {issue.location.room}</span>}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-semibold">🏷️</span>
                                                <span>{issue.category}</span>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/issues/${issue._id}`}
                                            className="inline-block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>
                ) : (
                    validIssues.map((issue) => (
                        <Marker
                            key={issue._id}
                            position={[
                                issue.location.coordinates.lat,
                                issue.location.coordinates.lng
                            ]}
                            icon={createCustomIcon(issue.status, issue.category)}
                        >
                            <Popup maxWidth={300} className="custom-popup">
                                <div className="p-2">
                                    <h3 className="font-bold text-gray-900 mb-2 text-base">
                                        {issue.title}
                                    </h3>

                                    <div className="flex gap-2 mb-2">
                                        <StatusBadge status={issue.status} />
                                        <SeverityBadge severity={issue.severity} />
                                    </div>

                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {issue.description}
                                    </p>

                                    <div className="text-xs text-gray-500 mb-3">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="font-semibold">📍</span>
                                            <span>{issue.location.building}</span>
                                            {issue.location.floor && <span>, Floor {issue.location.floor}</span>}
                                            {issue.location.room && <span>, Room {issue.location.room}</span>}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold">🏷️</span>
                                            <span>{issue.category}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/issues/${issue._id}`}
                                        className="inline-block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))
                )}
            </MapContainer>

            {/* Issue count badge */}
            <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {validIssues.length} {validIssues.length === 1 ? 'Issue' : 'Issues'} on Map
                </p>
            </div>
        </div>
    );
};

export default CampusMap;
