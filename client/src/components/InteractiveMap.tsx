import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Plus, Minus } from 'lucide-react';

interface Driver {
  id: string;
  lat: number;
  lng: number;
  heading: number;
  status: 'available' | 'busy' | 'offline';
  name: string;
}

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  drivers?: Driver[];
  showDrivers?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  className?: string;
}

export function InteractiveMap({ 
  center = { lat: 18.0179, lng: -76.8099 }, // Kingston, Jamaica
  zoom = 12,
  drivers = [],
  showDrivers = true,
  onLocationSelect,
  className = ""
}: MapProps) {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [mapCenter, setMapCenter] = useState(center);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Kingston area street data (simplified)
  const streets = [
    // Major roads
    { from: { x: 100, y: 200 }, to: { x: 400, y: 200 }, type: 'major', name: 'Spanish Town Road' },
    { from: { x: 200, y: 100 }, to: { x: 200, y: 300 }, type: 'major', name: 'Hope Road' },
    { from: { x: 150, y: 150 }, to: { x: 350, y: 250 }, type: 'major', name: 'Half Way Tree Road' },
    { from: { x: 50, y: 250 }, to: { x: 450, y: 250 }, type: 'major', name: 'Old Harbour Road' },
    
    // Minor streets
    { from: { x: 120, y: 180 }, to: { x: 280, y: 180 }, type: 'minor', name: 'Barry Street' },
    { from: { x: 160, y: 120 }, to: { x: 160, y: 280 }, type: 'minor', name: 'Orange Street' },
    { from: { x: 240, y: 130 }, to: { x: 240, y: 270 }, type: 'minor', name: 'King Street' },
    { from: { x: 180, y: 160 }, to: { x: 320, y: 160 }, type: 'minor', name: 'Duke Street' },
    { from: { x: 100, y: 220 }, to: { x: 300, y: 220 }, type: 'minor', name: 'Harbour Street' },
  ];

  // Landmarks
  const landmarks = [
    { x: 200, y: 200, name: 'Half Way Tree', type: 'transport-hub' },
    { x: 150, y: 240, name: 'Downtown Kingston', type: 'business' },
    { x: 280, y: 160, name: 'New Kingston', type: 'business' },
    { x: 220, y: 130, name: 'UWI Mona', type: 'education' },
    { x: 180, y: 280, name: 'Norman Manley Airport', type: 'airport' },
  ];

  // Live drivers with movement
  const [liveDrivers, setLiveDrivers] = useState<Driver[]>([
    { id: '1', lat: 18.0179, lng: -76.8099, heading: 45, status: 'available', name: 'Marcus' },
    { id: '2', lat: 18.0279, lng: -76.8199, heading: 180, status: 'busy', name: 'Keisha' },
    { id: '3', lat: 18.0079, lng: -76.8299, heading: 270, status: 'available', name: 'Andre' },
    { id: '4', lat: 18.0379, lng: -76.8399, heading: 90, status: 'available', name: 'Simone' },
    { id: '5', lat: 18.0479, lng: -76.8199, heading: 135, status: 'busy', name: 'Devon' },
  ]);

  // Animate drivers
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDrivers(prev => prev.map(driver => ({
        ...driver,
        lat: driver.lat + (Math.random() - 0.5) * 0.002,
        lng: driver.lng + (Math.random() - 0.5) * 0.002,
        heading: driver.heading + (Math.random() - 0.5) * 30,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleZoomIn = () => {
    setCurrentZoom(Math.min(currentZoom + 1, 18));
  };

  const handleZoomOut = () => {
    setCurrentZoom(Math.max(currentZoom - 1, 8));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setMapCenter(prev => ({
      lat: prev.lat - deltaY * 0.0001,
      lng: prev.lng + deltaX * 0.0001
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const latToY = (lat: number) => {
    const scale = Math.pow(2, currentZoom);
    return ((center.lat - lat) * scale * 100000) + 200;
  };

  const lngToX = (lng: number) => {
    const scale = Math.pow(2, currentZoom);
    return ((lng - center.lng) * scale * 100000) + 250;
  };

  return (
    <div className={`relative bg-white rounded-2xl overflow-hidden border-2 border-blue-200 shadow-xl ${className}`}>
      {/* Map Container - Uber-style clean design */}
      <div 
        ref={mapRef}
        className="relative w-full h-96 bg-gradient-to-br from-blue-50 via-white to-blue-50 cursor-move select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        
        {/* Grid Background */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="opacity-20">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Streets - Uber-style clean roads */}
        <svg className="absolute inset-0 w-full h-full">
          {streets.map((street, index) => (
            <g key={index}>
              <line
                x1={street.from.x}
                y1={street.from.y}
                x2={street.to.x}
                y2={street.to.y}
                stroke={street.type === 'major' ? '#cbd5e1' : '#e2e8f0'}
                strokeWidth={street.type === 'major' ? '4' : '2'}
                className="opacity-90"
              />
              <line
                x1={street.from.x}
                y1={street.from.y}
                x2={street.to.x}
                y2={street.to.y}
                stroke={street.type === 'major' ? '#2563eb' : '#475569'}
                strokeWidth={street.type === 'major' ? '2' : '1'}
                className="opacity-70"
              />
              {/* Street name labels - cleaner typography */}
              <text
                x={(street.from.x + street.to.x) / 2}
                y={(street.from.y + street.to.y) / 2}
                fill="#1f2937"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                className="opacity-80 pointer-events-none"
              >
                {currentZoom > 13 && street.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Landmarks */}
        {landmarks.map((landmark, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: landmark.x, top: landmark.y }}
          >
            <div className={`w-3 h-3 rounded-full ${
              landmark.type === 'transport-hub' ? 'bg-blue-500' :
              landmark.type === 'business' ? 'bg-purple-500' :
              landmark.type === 'education' ? 'bg-green-500' :
              'bg-orange-500'
            } shadow-lg`} />
            {currentZoom > 12 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 bg-white/95 border border-gray-200 px-2 py-1 rounded shadow-sm whitespace-nowrap">
                {landmark.name}
              </div>
            )}
          </div>
        ))}

        {/* Live Drivers - Uber-style with Caribbean flair */}
        {showDrivers && liveDrivers.map((driver) => (
          <div
            key={driver.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-2000 ease-linear"
            style={{ 
              left: lngToX(driver.lng), 
              top: latToY(driver.lat),
              transform: `translate(-50%, -50%) rotate(${driver.heading}deg)`
            }}
          >
            <div className={`relative w-5 h-5 rounded-full border-3 border-white shadow-xl ${
              driver.status === 'available' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
              driver.status === 'busy' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
              'bg-gradient-to-r from-gray-400 to-gray-500'
            } hover:scale-110 transition-transform`}>
              {/* Direction indicator - sleeker */}
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-white shadow-sm" />
              {/* Pulse effect for available drivers */}
              {driver.status === 'available' && (
                <div className="absolute -inset-1 rounded-full bg-green-400/30 animate-ping" />
              )}
            </div>
            
            {currentZoom > 14 && (
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-800 bg-white/95 px-3 py-1.5 rounded-lg whitespace-nowrap border border-gray-200 shadow-lg backdrop-blur-sm">
                {driver.name} • {driver.status === 'available' ? '🟢 Available' : driver.status === 'busy' ? '🟡 On Trip' : '⚫ Offline'}
              </div>
            )}
          </div>
        ))}

        {/* Current location marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
            <div className="absolute inset-0 w-6 h-6 bg-blue-500/30 rounded-full animate-ping" />
          </div>
        </div>
      </div>

      {/* Map Controls - Clean Uber-style */}
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="w-12 h-12 bg-white/95 border border-gray-200 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all shadow-lg backdrop-blur-sm"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-12 h-12 bg-white/95 border border-gray-200 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all shadow-lg backdrop-blur-sm"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Map Info - Modern design */}
      <div className="absolute bottom-4 left-4 bg-white/95 border border-gray-200 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm">
        <div className="text-sm text-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-blue-600">Kingston, Jamaica</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-3">
            <span>Zoom: {currentZoom}</span>
            <span className="text-green-600 font-medium">
              {liveDrivers.filter(d => d.status === 'available').length} Available Drivers
            </span>
          </div>
        </div>
      </div>

      {/* Legend - Cleaner Caribbean style */}
      <div className="absolute top-4 left-4 bg-white/95 border border-gray-200 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm">
        <div className="text-xs text-gray-700 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm" />
            <span className="font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-sm" />
            <span className="font-medium">On Trip</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm animate-pulse" />
            <span className="font-medium">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}