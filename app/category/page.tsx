"use client";

import { useEffect } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import CategoryCard from "@/components/ui/CategoryCard";



export default function CategoriesPage() {
      
  const { categories, loading, error, fetchCategories } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
    
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-slate-900 py-20 text-center text-white">
        <h1 className="text-5xl font-black mb-4">Browse Categories</h1>
        <p className="text-slate-300">
          Find products by category and explore collections
        </p>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading && (
          <div className="text-center py-32">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            Loading categories...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 font-semibold">
            {error}
          </div>
        )}
      

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <CategoryCard key={cat.categoryId} category={cat} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
  
}
