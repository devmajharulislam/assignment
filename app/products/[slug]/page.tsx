"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useProductsStore, Product } from "@/store/useProductStore";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { fetchProductBySlug } = useProductsStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchProductBySlug(slug);
      setProduct(data);
      setLoading(false);
    }
    load();
  }, [slug, fetchProductBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800 font-medium">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen text-center py-20 text-gray-800 font-semibold">
        Product not found
      </div>
    );
  }

  const imageUrl = `https://cdn-nextshop.prospectbdltd.com/api/temporary-url/${product.thumbnail}`;

  // ✅ Add to Cart using the same logic as Products Page
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!product) return;

    // Get existing cart from localStorage
    const stored = localStorage.getItem("cart");
    const cart: (Product & { quantity: number })[] = stored
      ? JSON.parse(stored)
      : [];

    // Check if product is already in cart
    const exists = cart.find((p) => p.productId === product.productId);
    if (!exists) {
      cart.push({ ...product, quantity: 1 }); // add quantity field
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.productName} added to cart!`);
    } else {
      alert(`${product.productName} is already in the cart`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-lg">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner">
          <Image
            src={imageUrl}
            alt={product.productName}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
              {product.productName}
            </h1>

            {product.brand && (
              <p className="text-indigo-700 font-semibold mb-2 text-lg">
                Brand: {product.brand.brandName}
              </p>
            )}

            <p
              className="text-gray-800 mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />

            <p className="text-3xl font-bold text-gray-900 mb-6">
              ${Number(product.finalPrice ?? 0).toFixed(2)}
            </p>

            {product.inStock ? (
              <p className="text-green-700 font-medium mb-4">
                In Stock ({product.stockQuantity})
              </p>
            ) : (
              <p className="text-red-600 font-medium mb-4">Out of Stock</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`py-3 rounded-lg font-semibold text-lg transition w-full ${
              product.inStock
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
