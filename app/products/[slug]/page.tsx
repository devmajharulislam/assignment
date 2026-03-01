"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useProductsStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import Reactions from "@/components/Reactions";
import { useReactionsStore } from "@/store/useReactionStore";


const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

// --- Robust Interfaces ---

interface ReactionType {
    typeId: number;
    type: string;
}

interface User {
    id: number;
    username: string;
    email: string;
}

interface Comment {
    commentId: number;
    comment: string;
    user: User | null;
    createdAt: string;
}

interface Price {
    final: number;
    original: number;
}

interface Stock {
    inStock: boolean;
    availability: string;
    quantity: number;
}

interface ProductVariant {
    productVariantId: number;
    price: Price;
    stock: Stock;
    attributes: Record<string, string>;
}

interface Product {
    productId: number;
    productName: string;
    thumbnail: string | null;
    shortDescription: string;
    brand?: { brandName: string };
    category?: { categoryName: string };
    variants: ProductVariant[];
    specifications?: Record<string, Record<string, string | string[]>>;
    userReacted?: boolean;
    userReaction?: { typeId: number; reaction_type?: { typeId: number } } | null;
    reactions?: Array<{ type?: { typeId: number }; reaction_type?: { typeId: number } }>;
    comments?: Comment[];
    userComments?: Comment[];
}

function resolveImage(thumbnail?: string | null) {
    if (!thumbnail) return "/placeholder.jpg";
    if (thumbnail.startsWith("http")) return thumbnail;
    return `${process.env.NEXT_PUBLIC_CDN_BASEURL}/${thumbnail}`;
}


export default function ProductDetailsPage() {
    const {
      reactionTypes,
      getReactionTypes,
      addReaction,
      deleteReaction
      
    } = useReactionsStore();

    useEffect(()=>{
        getReactionTypes();
    },[])
       
    // console.log("Reaction types ", reactionTypes)
    const params = useParams();
    const slug = typeof params?.slug === "string" ? params.slug : "";

    const { fetchProductBySlug } = useProductsStore();
    const { addToCart } = useCartStore();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [imgSrc, setImgSrc] = useState("/placeholder.jpg");
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);

    // Reactions state
    // const [reactionTypes, setReactionTypes] = useState<ReactionType[]>([]);
    const [userReaction, setUserReaction] = useState<number | null>(null);
    const [showReactions, setShowReactions] = useState(false);
    const [reactionCounts, setReactionCounts] = useState<Record<number, number>>({});

    // Comments state
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        async function load() {
            if (!slug) return;
            const data: Product = await fetchProductBySlug(slug);
            setProduct(data);
            setImgSrc(resolveImage(data?.thumbnail));

            if (data) {
                const defaultVariant = data.variants?.find((v) => v.stock?.inStock) || data.variants?.[0] || null;
                setSelectedVariant(defaultVariant);

                if (data.userReacted && data.userReaction) {
                    setUserReaction(data.userReaction.typeId || data.userReaction.reaction_type?.typeId || null);
                }

                const counts: Record<number, number> = {};
                data.reactions?.forEach((reaction) => {
                    const typeId = reaction.type?.typeId || reaction.reaction_type?.typeId;
                    if (typeId) {
                        counts[typeId] = (counts[typeId] || 0) + 1;
                    }
                });
                setReactionCounts(counts);
                setComments(data.comments || data.userComments || []);
            }
            setLoading(false);
        }
        load();
    }, [slug, fetchProductBySlug]);

    

    const handleAddComment = async () => {
        if (!product || !newComment.trim()) return;
        setCommentLoading(true);
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch(`${API}/client/v1/product/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Tenant": "nextshop",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ productId: product.productId, comment: newComment }),
            });
            if (res.ok) {
                const data = await res.json();
                setComments((prev) => [data.data, ...prev]);
                setNewComment("");
            }
        } catch (err) { console.error(err); } finally { setCommentLoading(false); }
    };

    const handleAddToCart = async () => {
        if (!product || !selectedVariant) return;
        setAddingToCart(true);
        const success = await addToCart(product.productId, selectedVariant.productVariantId, 1);
        if (success) alert(`${product.productName} added to cart!`);
        setAddingToCart(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div></div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    // const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-lg mb-8">
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={imgSrc}
                alt={product.productName}
                fill
                unoptimized
                className="object-cover"
                onError={() => setImgSrc("/placeholder.jpg")}
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                {product.productName}
              </h1>
              {product.brand && (
                <p className="text-indigo-600 font-semibold mb-2">
                  Brand: {product.brand.brandName}
                </p>
              )}
              {product.category && (
                <p className="text-gray-600 mb-4">
                  Category: {product.category.categoryName}
                </p>
              )}
              <div
                className="text-gray-700 mb-6"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />

              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-900">
                    Select Variant:
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.variants.map((variant) => {
                      const isSelected =
                        selectedVariant?.productVariantId ===
                        variant.productVariantId;
                      const isAvailable = variant.stock?.inStock;
                      return (
                        <button
                          key={variant.productVariantId}
                          onClick={() =>
                            isAvailable && setSelectedVariant(variant)
                          }
                          disabled={!isAvailable}
                          className={`p-3 border-2 rounded-lg text-left transition-all ${isSelected ? "border-indigo-600 bg-indigo-50" : isAvailable ? "border-gray-300 hover:border-indigo-400" : "border-gray-200 opacity-50 cursor-not-allowed"}`}
                        >
                          <div className="text-sm font-semibold text-gray-900">
                            {Object.values(variant.attributes || {}).join(" ")}
                          </div>
                          <div className="text-lg font-bold text-indigo-600">
                            ${Number(variant.price?.final || 0).toFixed(2)}
                          </div>
                          {!isAvailable && (
                            <span className="text-xs text-red-600">
                              Out of Stock
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedVariant && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${Number(selectedVariant.price?.final || 0).toFixed(2)}
                    </span>
                    {selectedVariant.price?.original !==
                      selectedVariant.price?.final && (
                      <span className="text-lg line-through text-gray-500">
                        $
                        {Number(selectedVariant.price?.original || 0).toFixed(
                          2,
                        )}
                      </span>
                    )}
                  </div>
                  <p
                    className={`font-medium ${selectedVariant.stock?.inStock ? "text-green-600" : "text-red-600"}`}
                  >
                    {selectedVariant.stock?.availability} (
                    {selectedVariant.stock?.quantity} available)
                  </p>
                </div>
              )}

              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Specifications:
                    </h3>
                    {Object.entries(product.specifications).map(
                      ([category, specs]) => (
                        <div key={category} className="mb-3">
                          <p className="font-medium text-indigo-600 mb-1">
                            {category}:
                          </p>
                          {Object.entries(specs).map(([key, values]) => (
                            <p key={key} className="text-sm text-gray-700 ml-2">
                              <span className="font-medium">{key}:</span>{" "}
                              {Array.isArray(values)
                                ? values.join(", ")
                                : values}
                            </p>
                          ))}
                        </div>
                      ),
                    )}
                  </div>
                )}

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.stock?.inStock || addingToCart}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition ${selectedVariant?.stock?.inStock && !addingToCart ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
              >
                {addingToCart
                  ? "Adding..."
                  : selectedVariant?.stock?.inStock
                    ? "Add to Cart"
                    : "Out of Stock"}
              </button>
            </div>
          </div>
          {/* Internal Reactions UI */}
          
          {/* <Reactions
            productId={product.productId}
            initialUserReaction={product.userReaction}
            initialReactions={product.reactions}
          /> */}
          {/* Comments */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Comments ({comments.length})
            </h3>
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900 bg-white"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={commentLoading || !newComment.trim()}
                className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300"
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </button>
            </div>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No comments yet. Be the first!
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.commentId}
                    className="border-b pb-4 last:border-0"
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {comment.user?.username?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {comment.user?.username || "Anonymous"}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
}