"use client";

import { useState, useEffect } from "react";

interface FilterProps {
  products: any[];
  onFilterChange: (filtered: any[]) => void;
  initialCategories?: string[]; // ✅ NEW: Allow pre-selecting categories
}

interface PriceRange {
  min: number;
  max: number;
}

export default function ProductFilter({
  products,
  onFilterChange,
  initialCategories = [],
}: FilterProps) {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories); // ✅ Use initial value
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 10000,
  });
  const [tempPriceRange, setTempPriceRange] = useState<PriceRange>({
    min: 0,
    max: 10000,
  });
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique categories and brands from products
  const categories = Array.from(
    new Set(products.map((p) => p.category?.categoryName).filter(Boolean)),
  ) as string[];

  const brands = Array.from(
    new Set(products.map((p) => p.brand?.brandName).filter(Boolean)),
  ) as string[];

  // Get price range from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => Number(p.finalPrice || 0));
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setPriceRange({ min, max });
      setTempPriceRange({ min, max });
    }
  }, [products]);

  // Apply filters whenever selections change
  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedBrands, priceRange]);

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category?.categoryName),
      );
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBrands.includes(p.brand?.brandName),
      );
    }

    // Filter by price range
    filtered = filtered.filter((p) => {
      const price = Number(p.finalPrice || 0);
      return price >= priceRange.min && price <= priceRange.max;
    });

    onFilterChange(filtered);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const handlePriceChange = () => {
    setPriceRange(tempPriceRange);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    const prices = products.map((p) => Number(p.finalPrice || 0));
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    setPriceRange({ min, max });
    setTempPriceRange({ min, max });
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange.min > 0 || priceRange.max < 10000 ? 1 : 0);

  return (
    <div className="mb-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <span className="font-semibold text-gray-900">
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filter Panel */}
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all ${
          isOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter Products
            </h2>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Categories
                {selectedCategories.length > 0 && (
                  <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {category}
                    </span>
                  </label>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No categories available
                  </p>
                )}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Brands
                {selectedBrands.length > 0 && (
                  <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                    {selectedBrands.length}
                  </span>
                )}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {brand}
                    </span>
                  </label>
                ))}
                {brands.length === 0 && (
                  <p className="text-sm text-gray-500">No brands available</p>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 mb-1 block">
                      Min
                    </label>
                    <input
                      type="number"
                      value={tempPriceRange.min}
                      onChange={(e) =>
                        setTempPriceRange({
                          ...tempPriceRange,
                          min: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Min"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 mb-1 block">
                      Max
                    </label>
                    <input
                      type="number"
                      value={tempPriceRange.max}
                      onChange={(e) =>
                        setTempPriceRange({
                          ...tempPriceRange,
                          max: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePriceChange}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Apply Price Filter
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ${priceRange.min} - ${priceRange.max}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {cat}
                    <button
                      onClick={() => handleCategoryToggle(cat)}
                      className="hover:bg-indigo-200 rounded-full p-0.5"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {brand}
                    <button
                      onClick={() => handleBrandToggle(brand)}
                      className="hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
