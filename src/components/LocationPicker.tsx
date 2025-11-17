import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type LatLngExpression, type LeafletMouseEvent } from "leaflet";

// Fix lỗi không hiển thị icon marker (Giữ nguyên)
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Input } from "./ui/input";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- Định nghĩa Types (Giữ nguyên) ---

interface Props {
  value: string;
  onSelect: (address: string) => void;
}

interface LocationClickHandlerProps {
  onPositionChange: (pos: L.LatLng, address: string) => void;
}

interface NominatimResponse {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

// --- Component con xử lý sự kiện (Giữ nguyên) ---

const LocationClickHandler: React.FC<LocationClickHandlerProps> = ({
  onPositionChange,
}) => {
  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      const newPos = e.latlng;
      onPositionChange(newPos, "Đang tải tên địa điểm...");

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}`
      )
        .then((res) => res.json())
        .then((data: NominatimResponse) => {
          if (data && data.display_name) {
            onPositionChange(newPos, data.display_name);
          } else {
            onPositionChange(newPos, "Không tìm thấy tên địa điểm");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi gọi Nominatim API:", err);
          onPositionChange(newPos, "Lỗi khi lấy địa điểm");
        });
    },
  });

  return null;
};

// Component MapFlyTo (Giữ nguyên)
interface MapFlyToProps {
  position: LatLngExpression;
}
const MapFlyTo: React.FC<MapFlyToProps> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);
  return null;
};

// --- Component chính (ĐÃ CHUYỂN SANG TAILWIND) ---

export const LocationPicker: React.FC<Props> = ({ value, onSelect }) => {
  const defaultCenter: LatLngExpression = [21.028511, 105.804817]; // Hà Nội

  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [addressName, setAddressName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Logic handlePositionChange (Giữ nguyên)
  const handlePositionChange = (newPos: L.LatLng, newAddress: string) => {
    setPosition(newPos);
    setAddressName(newAddress);

    if (
      newAddress !== "Đang tải tên địa điểm..." &&
      newAddress !== "Không tìm thấy tên địa điểm" &&
      newAddress !== "Lỗi khi lấy địa điểm"
    ) {
      setSearchQuery(newAddress);
      onSelect(newAddress);
    }
  };

  // Logic handleSearch (Giữ nguyên)
  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    setAddressName("Đang tìm kiếm...");
    setPosition(null);

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery
      )}&limit=1`
    )
      .then((res) => res.json())
      .then((data: NominatimResponse[]) => {
        if (data && data.length > 0) {
          const result = data[0];
          const newPos: LatLngExpression = [
            parseFloat(result.lat),
            parseFloat(result.lon),
          ];

          setPosition(newPos);
          setAddressName(result.display_name);
          onSelect(result.display_name);
          setSearchQuery(result.display_name);
        } else {
          setAddressName("Không tìm thấy địa điểm này");
          setPosition(null);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tìm kiếm:", err);
        setAddressName("Lỗi khi tìm kiếm");
      });
  };

  // Logic useEffect (Giữ nguyên)
  useEffect(() => {
    if (value && value !== searchQuery) {
      setSearchQuery(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      {/* UI cho ô tìm kiếm (ĐÃ CẬP NHẬT) */}
      <div className="flex mb-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nhập hoặc chọn địa điểm để tìm..."
          // Hợp nhất các class cũ và mới
          className="flex-1  rounded-l bg-white/5 border border-[#00FF80]/30 text-white"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          // Hợp nhất các class cũ và mới
          className="bg-[#00FF80] text-black px-3 rounded-r"
        >
          Tìm
        </button>
      </div>

      {/* Bản đồ (ĐÃ CẬP NHẬT) */}
      <div
        // Chuyển đổi style sang Tailwind
        className="h-[300px] w-full rounded-lg overflow-hidden relative"
      >
        <MapContainer
          center={defaultCenter}
          zoom={10}
          // Chuyển đổi style sang Tailwind
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {position && (
            <Marker position={position}>
              <Popup>{addressName}</Popup>
            </Marker>
          )}

          <LocationClickHandler onPositionChange={handlePositionChange} />

          {position && <MapFlyTo position={position} />}
        </MapContainer>
        <small
          // Chuyển đổi style sang Tailwind
          // Sử dụng cú pháp giá trị tùy ý (arbitrary values)
          // để giữ nguyên kích thước chính xác
          className="absolute bottom-[10px] left-[10px] z-[1000] rounded-[3px] bg-white/70 px-1.5 py-0.5 text-black text-xs"
        >
          Click vào bản đồ để chọn, hoặc tìm kiếm ở trên
        </small>
      </div>
    </div>
  );
};
