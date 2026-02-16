"use client";

import Link from "next/link";

import { Category } from "@/store/useCategoryStore";

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {


  return (
    <Link href={`/products?category=${category.categoryId}`}>
      <div className="group bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer border">
        <div className="p-4 text-center">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
            {category.categoryName}
          </h3>
        </div>
      </div>
    </Link>
  );
}
