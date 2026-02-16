"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/store/useProductStore";

interface ProductCardProps {
  product: Product;
}

function resolveImage(thumbnail?: string) {
  if (!thumbnail) return "/placeholder.jpg";

  if (thumbnail.startsWith("http")) return thumbnail;

  return `${process.env.NEXT_PUBLIC_CDN_BASEURL}/${thumbnail}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(resolveImage(product.thumbnail));
  const rating = Number(product.rating) || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem("cart");
    const cart: Product[] = stored ? JSON.parse(stored) : [];

    const exists = cart.find((p) => p.productId === product.productId);

    if (!exists) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.productName} added to cart!`);
    } else {
      alert(`${product.productName} is already in the cart`);
    }
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imgSrc}
            alt={product.productName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />

          {!product.inStock && (
            <div className="absolute top-3 left-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          {product.brand && (
            <p className="text-xs text-indigo-600 font-medium uppercase mb-2">
              {product.brand.brandName}
            </p>
          )}

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.productName}
          </h3>

          <p
            className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1"
            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
          />

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.commentsCount})
            </span>
          </div>

          {/* Price */}
          <span className="text-2xl font-bold text-gray-900">
            ${Number(product.finalPrice || 0).toFixed(2)}
          </span>

          {/* Add to Cart */}
          <button
            className={`mt-4 w-full py-2.5 rounded-lg font-medium transition-colors ${
              product.inStock
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </Link>
  );
}
