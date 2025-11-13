import { Image } from "cloudinary-react";
import { useNavigate } from "react-router-dom";

function extractPublicId(cloudinaryUrl) {
  try {
    const parts = cloudinaryUrl.split("/upload/");
    if (parts.length < 2) return null;

    // Remove version string if it exists (e.g., v1748840541/)
    const path = parts[1].replace(/^v\d+\//, "");
    return decodeURIComponent(path); // handle special characters like é
  } catch {
    return null;
  }
}

export default function BikeCard({ bike }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // TODO: Navigate to bike details page
    navigate(`/shop/${bike.brand}/${bike._id}`);
  };

  const images = JSON.parse(bike.colors);
  const firstImage = Object.values(images)[0];

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-shrink-0 flex-col overflow-hidden rounded-lg border-2 border-gray-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-500 hover:shadow-sm m-4 border-gray-400 shadow-lg"
    >
      <Image
        cloudName="ds4ukwnxl"
        publicId={extractPublicId(firstImage)}
        width="540"
        crop="pad"
        quality="100"
        fetchFormat="auto"
        alt={bike.name}
        style={{
          width: "400px",
          height: "200px",
          objectFit: "contain",
          display: "block",
        }}
      />
      <div className="flex flex-col bg-white px-4 py-3 text-left">
        {bike.saleprice ? (
          <div className="absolute right-4 top-2 text-white bg-red-400 px-2 py-1 text-xs rounded-md">
            Sale
          </div>
        ) : (
          <div></div>
        )}
        <div className="text-sm font-semibold text-gray-900">
          {bike.brand} {bike.name}
        </div>
        <div className="mt-2 font-medium flex flex-row justify-between border-t border-gray-600 py-2 text-sm text-gray-700">
          {bike.saleprice ? (
            <div className="flex flex-row items-center gap-1">
              <div className="line-through">${bike.price}</div>
              <div>${bike.saleprice}</div>
            </div>
          ) : (
            <div>${bike.price}</div>
          )}
          <div className="flex flex-row items-center gap-1">{bike.type}</div>
        </div>
      </div>
    </button>
  );
}
