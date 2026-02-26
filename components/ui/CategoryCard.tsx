"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Category } from "@/store/useCategoryStore";

function resolveImage(imageUrl: string | null): string {
  if (!imageUrl) return "/placeholder.jpg";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${process.env.NEXT_PUBLIC_CDN_BASEURL}/${imageUrl}`;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(resolveImage(category.imageUrl));

  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.categoryName)}`}
    >
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imgSrc}
            alt={category.categoryName}
            fill
            unoptimized
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
          <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-all duration-300" />
        </div>

        <div className="p-4 text-center">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {category.categoryName}
          </h3>
          {category.children && category.children.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
             
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
