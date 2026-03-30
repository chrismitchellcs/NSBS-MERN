import { Image } from "cloudinary-react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { extractPublicId } from "utils/bikeDisplay";

function BikeCard({ bike, embedInCarousel = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // TODO: Navigate to bike details page
    navigate(`/shop/${bike.brand}/${bike._id}`);
  };

  const images = JSON.parse(bike.colors);
  const firstImage = Object.values(images)[0];

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        embedInCarousel
          ? "relative flex w-full max-w-[400px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-gray-300 border-1 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-500 hover:shadow-sm my-1"
          : "relative m-4 flex flex-shrink-0 flex-col overflow-hidden rounded-lg border border-gray-300 border-1 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-500 hover:shadow-sm"
      }
    >
      <Image
        cloudName="ds4ukwnxl"
        publicId={extractPublicId(firstImage)}
        width="420"
        crop="pad"
        quality="auto"
        fetchFormat="auto"
        alt={bike.name}
        style={{
          width: "400px",
          height: "200px",
          objectFit: "contain",
          display: "block",
        }}
      />
      <div className="flex flex-col bg-white px-4 py-3 text-left w-full">
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
              <div className="line-through">${bike.price.toLocaleString()}</div>
              <div>${bike.saleprice.toLocaleString()}</div>
            </div>
          ) : (
            <div>${bike.price.toLocaleString()}</div>
          )}
          <div className="flex flex-row items-center gap-1">{bike.type}</div>
        </div>
      </div>
    </button>
  );
}

export default memo(BikeCard);
