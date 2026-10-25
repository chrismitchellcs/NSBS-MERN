import { Image } from "cloudinary-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import { bikePath } from "seo/seoData.mjs";
import { extractPublicId, getBikeFirstImageUrl } from "utils/bikeDisplay";
import { bikeHasVariantPricing, formatCadPrice, hasActiveShopSale } from "utils/shopPrice";

function BikeCard({ bike, embedInCarousel = false }) {
  const fromLabel = bikeHasVariantPricing(bike) ? "From " : "";
  const firstImage = getBikeFirstImageUrl(bike);
  const imagePublicId = firstImage ? extractPublicId(firstImage) : null;
  if (!imagePublicId) return null;

  return (
    <Link
      to={bikePath(bike)}
      className={
        embedInCarousel
          ? "relative flex w-full max-w-[400px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-gray-300 border-1 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-500 hover:shadow-sm my-1"
          : "relative flex w-full flex-col overflow-hidden rounded-lg border border-gray-300 border-1 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-500 hover:shadow-sm"
      }
    >
      <Image
        cloudName="ds4ukwnxl"
        publicId={imagePublicId}
        width="600"
        crop="pad"
        quality="auto"
        fetchFormat="auto"
        alt={`${bike.brand} ${bike.name}`}
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "2 / 1",
          objectFit: "contain",
          display: "block",
        }}
      />
      <div className="flex flex-col bg-white px-4 py-3 text-left w-full">
        {hasActiveShopSale(bike.saleprice) ? (
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
          {hasActiveShopSale(bike.saleprice) ? (
            <div className="flex flex-row items-center gap-1">
              {fromLabel ? <div>{fromLabel}</div> : null}
              <div className="line-through">${formatCadPrice(bike.price)}</div>
              <div>${formatCadPrice(bike.saleprice)}</div>
            </div>
          ) : (
            <div>
              {fromLabel}${formatCadPrice(bike.price)}
            </div>
          )}
          <div className="flex flex-row items-center gap-1">{bike.type}</div>
        </div>
      </div>
    </Link>
  );
}

export default memo(BikeCard);
