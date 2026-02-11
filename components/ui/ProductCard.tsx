"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/store/useProductStore";
import { getCDNImageUrl } from "@/lib/cdnUtils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = `${product.thumbnail}`;
  console.log("product thumbnail",product.thumbnail);
  const hasDiscount =
    product.sale_price && product.sale_price < product.finalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.finalPrice - product.finalPrice) / product.finalPrice) * 100,
      )
    : 0;

  return (
    <Link href={`/products/${product.productId}`}>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.productName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-product.png";
            }}
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              -{discountPercentage}%
            </div>
          )}

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category/Brand */}
          {product.category && (
            <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-2">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.productName}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>

          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {product.reviews_count !== undefined && (
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviews_count})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-indigo-600">
                  ${product.sale_price?.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.finalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ${product.finalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            className={`mt-4 w-full py-2.5 rounded-lg font-medium transition-colors ${
              product.stock > 0
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              if (product.stock > 0) {
                // TODO: Add to cart functionality
               
              }
            }}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </Link>
  );
}
