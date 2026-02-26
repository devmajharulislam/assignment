"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useProductsStore, Product } from "@/store/useProductStore";

function resolveImage(thumbnail?: string | null) {
  if (!thumbnail) return "/placeholder.jpg";
  if (thumbnail.startsWith("http")) return thumbnail;
  return `${process.env.NEXT_PUBLIC_CDN_BASEURL}/${thumbnail}`;
}

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { fetchProductBySlug } = useProductsStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState("/placeholder.jpg");

  // NEW: State to track which variant is selected (default to the first one)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await fetchProductBySlug(slug);
      setProduct(data);
      setImgSrc(resolveImage(data?.thumbnail));
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

  // Helper to get current variant data
  const currentVariant = product.variants?.[selectedVariantIndex];
  const price = currentVariant?.price?.final ?? 0;
  const isInStock = currentVariant?.stock?.inStock ?? false;
  const stockQty = currentVariant?.stock?.quantity ?? 0;

  // Add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentVariant) return;

    const stored = localStorage.getItem("cart");
    const cart: any[] = stored ? JSON.parse(stored) : [];

    // Check if THIS SPECIFIC variant is already in the cart
    const exists = cart.find(
      (p) =>
        p.productId === product.productId &&
        p.variantId === currentVariant.productVariantId,
    );

    if (!exists) {
      cart.push({
        ...product,
        quantity: 1,
        variantId: currentVariant.productVariantId,
        selectedVariant: currentVariant, // Store which one was picked
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(
        `${product.productName} (${Object.values(currentVariant.attributes).join(", ")}) added to cart!`,
      );
    } else {
      alert(`This item is already in the cart`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-lg">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner">
          <Image
            src={imgSrc}
            alt={product.productName}
            fill
            className="object-cover"
            onError={() => setImgSrc("/placeholder.jpg")}
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

            {/* VARIANTS SELECTOR */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Select Options:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.productVariantId}
                      onClick={() => setSelectedVariantIndex(index)}
                      className={`px-4 py-2 rounded-md border-2 transition-all text-sm font-medium ${
                        selectedVariantIndex === index
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {/* Dynamically show attributes like "16GB" or "Black" */}
                      {Object.values(variant.attributes).join(" / ")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p
              className="text-gray-800 mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />

            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </p>
              {currentVariant?.discount?.enabled && (
                <p className="text-sm text-green-600 font-semibold">
                  Save ${currentVariant.discount.amount}
                </p>
              )}
            </div>

            {isInStock ? (
              <p className="text-green-700 font-medium mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                In Stock ({stockQty} available)
              </p>
            ) : (
              <p className="text-red-600 font-medium mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Out of Stock
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`py-4 rounded-lg font-bold text-lg transition-all transform active:scale-95 w-full ${
              isInStock
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* OPTIONAL: Specifications table using the product.specifications object */}
      {product.specifications && (
        <div className="max-w-6xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
            Specifications
          </h2>
          <div className="space-y-8">
            {Object.entries(product.specifications).map(
              ([section, details]) => (
                <div key={section}>
                  <h3 className="text-indigo-600 font-bold uppercase text-xs mb-3 tracking-widest">
                    {section}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                    {Object.entries(details).map(([key, values]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b border-gray-50 py-2"
                      >
                        <span className="text-gray-500 text-sm font-medium">
                          {key}
                        </span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {(values as string[]).join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
