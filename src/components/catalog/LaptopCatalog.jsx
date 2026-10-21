import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Layers, 
  Sparkles, 
  X, 
  Check, 
  ArrowRight, 
  Filter, 
  CheckCircle2,
  Clock,
  Phone,
  RotateCcw,
  AlertCircle,
  HardDrive,
  Cpu,
  Tag
} from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import LaptopCard from './LaptopCard';
import LaptopDetailModal from './LaptopDetailModal';
import LaptopCompareModal from './LaptopCompareModal';
import { formatINR } from '../../utils/storage';

export default function LaptopCatalog({ 
  laptops, 
  cart, 
  onAddToCart,
  onBuyNow,
  onOpenCart 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLaptopForModal, setSelectedLaptopForModal] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating'

  // Multi-dimensional filter state
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    brands: [],
    processors: [],
    rams: [],
    storages: [],
    screens: [],
    grades: [],
    availability: 'all', // 'all' | 'in-stock' | 'out-of-stock'
    category: 'all',
    audience: 'all'
  });

  // Calculate distinct brands
  const availableBrands = useMemo(() => {
    const brandsSet = new Set(laptops.map(l => l.brand));
    return Array.from(brandsSet).sort();
  }, [laptops]);

  // Helper function to match laptop against active filters EXCEPT one dimension
  const matchesFilterExcept = useMemo(() => {
    return (laptop, excludeDim) => {
      // 1. Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = laptop.name.toLowerCase().includes(q);
        const matchesBrand = laptop.brand.toLowerCase().includes(q);
        const matchesModel = laptop.model.toLowerCase().includes(q);
        const matchesProc = laptop.processor.toLowerCase().includes(q);
        const matchesDesc = laptop.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesModel && !matchesProc && !matchesDesc) {
          return false;
        }
      }

      // 2. Price Range
      if (excludeDim !== 'price') {
        if (laptop.price < filters.minPrice || laptop.price > filters.maxPrice) {
          return false;
        }
      }

      // 3. Brands
      if (excludeDim !== 'brands' && filters.brands.length > 0) {
        if (!filters.brands.includes(laptop.brand)) return false;
      }

      // 4. Processors
      if (excludeDim !== 'processors' && filters.processors.length > 0) {
        const matchesProc = filters.processors.some(p => {
          if (p === 'Apple Silicon') return laptop.processor.includes('Apple M');
          if (p === 'AMD Ryzen') return laptop.processor.toLowerCase().includes('ryzen');
          return laptop.processor.toLowerCase().includes(p.toLowerCase());
        });
        if (!matchesProc) return false;
      }

      // 5. RAM
      if (excludeDim !== 'rams' && filters.rams.length > 0) {
        if (!filters.rams.includes(laptop.ramSize)) return false;
      }

      // 6. Storage
      if (excludeDim !== 'storages' && filters.storages.length > 0) {
        if (!filters.storages.includes(laptop.storageSize)) return false;
      }

      // 7. Screen Size
      if (excludeDim !== 'screens' && filters.screens.length > 0) {
        if (!filters.screens.includes(laptop.screenSize)) return false;
      }

      // 8. Condition Grade
      if (excludeDim !== 'grades' && filters.grades.length > 0) {
        if (!filters.grades.includes(laptop.conditionGrade)) return false;
      }

      // 9. Availability
      if (excludeDim !== 'availability' && filters.availability && filters.availability !== 'all') {
        const isAvail = laptop.inStock && laptop.stockCount > 0;
        if (filters.availability === 'in-stock' && !isAvail) return false;
        if (filters.availability === 'out-of-stock' && isAvail) return false;
      }

      return true;
    };
  }, [searchQuery, filters]);

  // Calculate Price Statistics for laptops matching active non-price specs
  const priceStats = useMemo(() => {
    const matchingForPrice = laptops.filter(l => matchesFilterExcept(l, 'price'));
    const overallMin = laptops.length ? Math.min(...laptops.map(l => l.price)) : 10000;
    const overallMax = laptops.length ? Math.max(...laptops.map(l => l.price)) : 100000;

    if (matchingForPrice.length === 0) {
      return { minPrice: overallMin, maxPrice: overallMax, overallMin, overallMax };
    }

    const minPrice = Math.min(...matchingForPrice.map(l => l.price));
    const maxPrice = Math.max(...matchingForPrice.map(l => l.price));
    return { minPrice, maxPrice, overallMin, overallMax };
  }, [laptops, matchesFilterExcept]);

  // Auto-sync price range when RAM/SSD/specs change so user isn't locked out by low slider
  useEffect(() => {
    if (priceStats.minPrice !== Infinity && filters.maxPrice < priceStats.minPrice) {
      setFilters(prev => ({ ...prev, maxPrice: Math.max(priceStats.maxPrice, 60000) }));
    }
  }, [priceStats.minPrice, priceStats.maxPrice]);

  // Compute Faceted Counts for All Filter Dimensions
  const facetCounts = useMemo(() => {
    const ramOptions = [8, 16, 32];
    const storageOptions = [256, 512, 1024];
    const processorOptions = ["Intel Core i3", "Intel Core i5", "Intel Core i7", "AMD Ryzen", "Apple Silicon"];
    const screenOptions = [13.3, 14, 15.6];
    const gradeOptions = ["Grade A+ (Like New)", "Grade A+ (Pristine)", "Grade A (Excellent)"];
    const pricePresets = [
      { min: 0, max: 200000 },
      { min: 0, max: 20000 },
      { min: 20000, max: 30000 },
      { min: 30000, max: 45000 },
      { min: 45000, max: 200000 },
    ];

    // RAM counts
    const matchingForRams = laptops.filter(l => matchesFilterExcept(l, 'rams'));
    const rams = {};
    ramOptions.forEach(r => {
      rams[r] = matchingForRams.filter(l => l.ramSize === r).length;
    });

    // Storage counts
    const matchingForStorages = laptops.filter(l => matchesFilterExcept(l, 'storages'));
    const storages = {};
    storageOptions.forEach(s => {
      storages[s] = matchingForStorages.filter(l => l.storageSize === s).length;
    });

    // Processor counts
    const matchingForProc = laptops.filter(l => matchesFilterExcept(l, 'processors'));
    const processors = {};
    processorOptions.forEach(p => {
      processors[p] = matchingForProc.filter(l => {
        if (p === 'Apple Silicon') return l.processor.includes('Apple M');
        if (p === 'AMD Ryzen') return l.processor.toLowerCase().includes('ryzen');
        return l.processor.toLowerCase().includes(p.toLowerCase());
      }).length;
    });

    // Brand counts
    const matchingForBrands = laptops.filter(l => matchesFilterExcept(l, 'brands'));
    const brands = {};
    availableBrands.forEach(b => {
      brands[b] = matchingForBrands.filter(l => l.brand === b).length;
    });

    // Screen counts
    const matchingForScreens = laptops.filter(l => matchesFilterExcept(l, 'screens'));
    const screens = {};
    screenOptions.forEach(s => {
      screens[s] = matchingForScreens.filter(l => l.screenSize === s).length;
    });

    // Grade counts
    const matchingForGrades = laptops.filter(l => matchesFilterExcept(l, 'grades'));
    const grades = {};
    gradeOptions.forEach(g => {
      grades[g] = matchingForGrades.filter(l => l.conditionGrade === g).length;
    });

    // Price preset counts
    const matchingForPrice = laptops.filter(l => matchesFilterExcept(l, 'price'));
    const presetCounts = pricePresets.map(preset => {
      return matchingForPrice.filter(l => l.price >= preset.min && l.price <= preset.max).length;
    });

    // Availability counts
    const matchingForAvail = laptops.filter(l => matchesFilterExcept(l, 'availability'));
    const availability = {
      all: matchingForAvail.length,
      inStock: matchingForAvail.filter(l => l.inStock && l.stockCount > 0).length,
      outOfStock: matchingForAvail.filter(l => !l.inStock || l.stockCount <= 0).length
    };

    return {
      rams,
      storages,
      processors,
      brands,
      screens,
      grades,
      pricePresets: presetCounts,
      availability
    };
  }, [laptops, matchesFilterExcept, availableBrands]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.maxPrice < 100000 || filters.minPrice > 0) count++;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.processors.length > 0) count += filters.processors.length;
    if (filters.rams.length > 0) count += filters.rams.length;
    if (filters.storages.length > 0) count += filters.storages.length;
    if (filters.screens.length > 0) count += filters.screens.length;
    if (filters.grades.length > 0) count += filters.grades.length;
    if (filters.availability !== 'all') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [filters, searchQuery]);

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 100000,
      brands: [],
      processors: [],
      rams: [],
      storages: [],
      screens: [],
      grades: [],
      availability: 'all',
      category: 'all',
      audience: 'all'
    });
    setSearchQuery('');
  };

  // Filter and Sort Logic
  const filteredLaptops = useMemo(() => {
    return laptops.filter(laptop => {
      // 1. Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = laptop.name.toLowerCase().includes(q);
        const matchesBrand = laptop.brand.toLowerCase().includes(q);
        const matchesModel = laptop.model.toLowerCase().includes(q);
        const matchesProc = laptop.processor.toLowerCase().includes(q);
        const matchesDesc = laptop.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesModel && !matchesProc && !matchesDesc) {
          return false;
        }
      }

      // 2. Price Range
      if (laptop.price < filters.minPrice || laptop.price > filters.maxPrice) {
        return false;
      }

      // 3. Brands
      if (filters.brands.length > 0 && !filters.brands.includes(laptop.brand)) {
        return false;
      }

      // 4. Processors
      if (filters.processors.length > 0) {
        const matchesProc = filters.processors.some(p => {
          if (p === 'Apple Silicon') return laptop.processor.includes('Apple M');
          if (p === 'AMD Ryzen') return laptop.processor.toLowerCase().includes('ryzen');
          return laptop.processor.toLowerCase().includes(p.toLowerCase());
        });
        if (!matchesProc) return false;
      }

      // 5. RAM
      if (filters.rams.length > 0 && !filters.rams.includes(laptop.ramSize)) {
        return false;
      }

      // 6. Storage
      if (filters.storages.length > 0 && !filters.storages.includes(laptop.storageSize)) {
        return false;
      }

      // 7. Screen Size
      if (filters.screens.length > 0 && !filters.screens.includes(laptop.screenSize)) {
        return false;
      }

      // 8. Condition Grade
      if (filters.grades.length > 0 && !filters.grades.includes(laptop.conditionGrade)) {
        return false;
      }

      // 9. Availability
      if (filters.availability && filters.availability !== 'all') {
        const isAvail = laptop.inStock && laptop.stockCount > 0;
        if (filters.availability === 'in-stock' && !isAvail) return false;
        if (filters.availability === 'out-of-stock' && isAvail) return false;
      }

      return true;
    }).sort((a, b) => {
      // In-stock items prioritized over out-of-stock
      const aAvail = a.inStock && a.stockCount > 0 ? 1 : 0;
      const bAvail = b.inStock && b.stockCount > 0 ? 1 : 0;
      if (aAvail !== bAvail) return bAvail - aAvail;

      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') {
        const discA = (a.originalPrice - a.price) / a.originalPrice;
        const discB = (b.originalPrice - b.price) / b.originalPrice;
        return discB - discA;
      }
      // default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [laptops, searchQuery, filters, sortBy]);

  const toggleCompare = (laptop) => {
    setCompareList(prev => {
      const exists = prev.some(item => item.id === laptop.id);
      if (exists) {
        return prev.filter(item => item.id !== laptop.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 laptops at a time.');
        return prev;
      }
      return [...prev, laptop];
    });
  };

  const removeFromCompare = (id) => {
    setCompareList(prev => prev.filter(item => item.id !== id));
  };

  // Compile human-readable list of selected specs for WhatsApp restock inquiry
  const requestedSpecsList = useMemo(() => {
    const list = [];
    if (filters.rams.length > 0) list.push(`RAM: ${filters.rams.join(', ')} GB`);
    if (filters.storages.length > 0) list.push(`SSD: ${filters.storages.map(s => s >= 1024 ? '1 TB' : `${s} GB`).join(', ')}`);
    if (filters.processors.length > 0) list.push(`CPU: ${filters.processors.join(', ')}`);
    if (filters.brands.length > 0) list.push(`Brand: ${filters.brands.join(', ')}`);
    if (filters.screens.length > 0) list.push(`Screen: ${filters.screens.join(', ')}"`);
    if (filters.maxPrice < 100000) list.push(`Budget: Up to ${formatINR(filters.maxPrice)}`);
    if (searchQuery) list.push(`Search: "${searchQuery}"`);
    return list;
  }, [filters, searchQuery]);

  const whatsappRestockMessage = encodeURIComponent(
    `Hello RS Refurbished! I was browsing your catalog and found that laptops with the following specifications are currently temporarily unavailable:\n\n*${requestedSpecsList.join(' | ') || 'Configured Refurbished Laptop'}*\n\nCan you please check upcoming batch restock or suggest similar available models? Thank you!`
  );
  const whatsappRestockUrl = `https://wa.me/918668848486?text=${whatsappRestockMessage}`;

  return (
    <section id="catalog" className="py-12 bg-slate-50 bg-dot-pattern">
      <div className="site-container">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold mb-3 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Certified Refurbished Inventory
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Premium Laptops with Warranty
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Every laptop is 32-point tested, graded with genuine licenses, and backed by our comprehensive RS Warranty. Filter by price, brand, and hardware config below.
          </p>
        </div>

        {/* Top Control Bar: Search & Sort */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ThinkPad, MacBook, i7, 16GB, Dell..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              <Filter className="w-3.5 h-3.5 text-brand-600" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="featured">Featured & Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Highest Discount %</option>
              </select>
            </div>

          </div>

        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (Isolated Operation Section) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20 filter-scroll-container rounded-2xl group/sidebar">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
              availableBrands={availableBrands}
              totalResults={filteredLaptops.length}
              facetCounts={facetCounts}
              priceStats={priceStats}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
              <div className="w-80 bg-white h-full overflow-y-auto p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b mb-4">
                    <h3 className="font-bold text-slate-900">Refine Search</h3>
                    <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    resetFilters={resetFilters}
                    activeFilterCount={activeFilterCount}
                    availableBrands={availableBrands}
                    totalResults={filteredLaptops.length}
                    facetCounts={facetCounts}
                    priceStats={priceStats}
                  />
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-4 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-xl shadow-md"
                >
                  Apply Filters ({filteredLaptops.length} Results)
                </button>
              </div>
            </div>
          )}

          {/* Laptop Cards Grid / Empty State */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Active Filter Badges */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
                
                {filters.availability !== 'all' && (
                  <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                    Status: {filters.availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(p => ({ ...p, availability: 'all' }))} />
                  </span>
                )}

                {filters.brands.map(b => (
                  <span key={b} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                    Brand: {b}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(p => ({ ...p, brands: p.brands.filter(x => x !== b) }))} />
                  </span>
                ))}

                {filters.processors.map(pr => (
                  <span key={pr} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                    CPU: {pr}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(p => ({ ...p, processors: p.processors.filter(x => x !== pr) }))} />
                  </span>
                ))}

                {filters.rams.map(r => (
                  <span key={r} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                    RAM: {r} GB
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(p => ({ ...p, rams: p.rams.filter(x => x !== r) }))} />
                  </span>
                ))}

                {filters.storages.map(s => (
                  <span key={s} className="text-xs bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                    SSD: {s >= 1024 ? '1 TB' : `${s} GB`}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(p => ({ ...p, storages: p.storages.filter(x => x !== s) }))} />
                  </span>
                ))}

                {filters.screens.map(sc => (
                  <span key={sc} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                    Screen: {sc}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(p => ({ ...p, screens: p.screens.filter(x => x !== sc) }))} />
                  </span>
                ))}

                {filters.maxPrice < 100000 && (
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                    Max: {formatINR(filters.maxPrice)}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(p => ({ ...p, maxPrice: 100000, minPrice: 0 }))} />
                  </span>
                )}

                {searchQuery && (
                  <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                    "{searchQuery}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </span>
                )}

                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-rose-600 hover:underline ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Grid Container */}
            {filteredLaptops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLaptops.map(laptop => (
                  <LaptopCard
                    key={laptop.id}
                    laptop={laptop}
                    onViewDetails={setSelectedLaptopForModal}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                    isInCart={cart.some(c => c.id === laptop.id)}
                    isCompared={compareList.some(c => c.id === laptop.id)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            ) : (
              /* Enhanced Empty State: "Temporarily Unavailable" Message */
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-amber-200/90 shadow-xl shadow-amber-500/5 max-w-xl mx-auto relative overflow-hidden animate-fadeIn">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500" />
                
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-inner">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>

                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full mb-3 uppercase tracking-wider">
                  Inventory Restocking
                </span>

                <h3 className="font-black text-slate-900 text-xl sm:text-2xl mb-2">
                  This Laptop is Temporarily Unavailable
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
                  We currently do not have refurbished laptops in stock matching all of your selected specifications. Our procurement team receives certified enterprise batches weekly.
                </p>

                {/* Requested Specs Breakdown */}
                {requestedSpecsList.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Requested Specifications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {requestedSpecsList.map((spec, i) => (
                        <span key={i} className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg shadow-2xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Call-to-Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappRestockUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4" /> Inquire Restock via WhatsApp
                  </a>
                  <button
                    onClick={resetFilters}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all border border-slate-300 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-600" /> Reset Filters
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-4">
                  Need a custom corporate configuration? We supply enterprise fleets on order.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Floating Compare Action Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-4 animate-scaleUp">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-bold text-cyan-300">
              {compareList.length} / 3 Laptops Selected for Comparison
            </span>
          </div>
          <button
            onClick={() => setShowCompareModal(true)}
            className="text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white px-3 py-1 rounded-full transition-colors"
          >
            Compare Now
          </button>
          <button
            onClick={() => setCompareList([])}
            className="text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLaptopForModal && (
        <LaptopDetailModal
          laptop={selectedLaptopForModal}
          onClose={() => setSelectedLaptopForModal(null)}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          isInCart={cart.some(c => c.id === selectedLaptopForModal.id)}
        />
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <LaptopCompareModal
          compareList={compareList}
          onClose={() => setShowCompareModal(false)}
          onRemove={removeFromCompare}
          onAddToCart={onAddToCart}
        />
      )}

    </section>
  );
}
