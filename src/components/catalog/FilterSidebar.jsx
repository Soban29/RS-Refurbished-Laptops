import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Check, 
  SlidersHorizontal, 
  Tag, 
  Cpu, 
  HardDrive, 
  Layers, 
  Monitor, 
  Award, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { formatINR } from '../../utils/storage';

export default function FilterSidebar({
  filters,
  setFilters,
  resetFilters,
  activeFilterCount,
  availableBrands,
  totalResults,
  facetCounts = {}
}) {
  const processorOptions = [
    "Intel Core i3",
    "Intel Core i5",
    "Intel Core i7",
    "AMD Ryzen",
    "Apple Silicon"
  ];

  const ramOptions = [8, 16, 32];
  const storageOptions = [256, 512, 1024];
  const screenOptions = [13.3, 14, 15.6];
  const gradeOptions = ["Grade A++ (Like New)", "Grade A+ (Like New)"];

  // Helper to safely get counts
  const getRamCount = (r) => facetCounts.rams?.[r] ?? 0;
  const getStorageCount = (s) => facetCounts.storages?.[s] ?? 0;
  const getProcessorCount = (p) => facetCounts.processors?.[p] ?? 0;
  const getBrandCount = (b) => facetCounts.brands?.[b] ?? 0;
  const getScreenCount = (s) => facetCounts.screens?.[s] ?? 0;
  const getGradeCount = (g) => facetCounts.grades?.[g] ?? 0;

  // Toggle handlers with intelligent price range synchronization
  const toggleBrand = (brand) => {
    setFilters(prev => {
      const exists = prev.brands.includes(brand);
      return {
        ...prev,
        brands: exists ? prev.brands.filter(b => b !== brand) : [...prev.brands, brand]
      };
    });
  };

  const toggleProcessor = (proc) => {
    setFilters(prev => {
      const exists = prev.processors.includes(proc);
      return {
        ...prev,
        processors: exists ? prev.processors.filter(p => p !== proc) : [...prev.processors, proc]
      };
    });
  };

  const toggleRam = (size) => {
    setFilters(prev => {
      const exists = prev.rams.includes(size);
      return {
        ...prev,
        rams: exists ? prev.rams.filter(r => r !== size) : [...prev.rams, size]
      };
    });
  };

  const toggleStorage = (size) => {
    setFilters(prev => {
      const exists = prev.storages.includes(size);
      return {
        ...prev,
        storages: exists ? prev.storages.filter(s => s !== size) : [...prev.storages, size]
      };
    });
  };

  const toggleScreen = (size) => {
    setFilters(prev => {
      const exists = prev.screens.includes(size);
      return {
        ...prev,
        screens: exists ? prev.screens.filter(s => s !== size) : [...prev.screens, size]
      };
    });
  };

  const hasSelectedSpecs = filters.rams.length > 0 || filters.storages.length > 0 || filters.processors.length > 0 || filters.brands.length > 0;

  return (
    <aside className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-6 hover:border-brand-300 hover:shadow-md transition-all duration-200">
      
      {/* Header & Reset - Sticky inside isolated scroll container */}
      <div className="sticky -top-5 -mt-5 -mx-5 px-5 py-3.5 bg-white/95 backdrop-blur-md z-20 border-b border-slate-100 rounded-t-2xl flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg shadow-2xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-sm">Smart Filters</h3>
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200/80">
                Active Zone
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {totalResults} {totalResults === 1 ? 'Laptop Available' : 'Matching Laptops'}
            </p>
          </div>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors shadow-2xs"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" /> Reset ({activeFilterCount})
          </button>
        )}
      </div>

      {/* 0. Inventory Stock Status Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Availability
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, availability: 'all' }))}
            className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all text-center ${
              filters.availability === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({facetCounts.availability?.all ?? totalResults})
          </button>
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, availability: 'in-stock' }))}
            className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all text-center ${
              filters.availability === 'in-stock'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Stock ({facetCounts.availability?.inStock ?? 0})
          </button>
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, availability: 'out-of-stock' }))}
            className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all text-center ${
              filters.availability === 'out-of-stock'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Laptops currently awaiting restocking"
          >
            Out of Stock ({facetCounts.availability?.outOfStock ?? 0})
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* 2. Brand Selector with Faceted Counts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-600" /> Brand / Manufacturer
          </label>
          {filters.brands.length > 0 && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, brands: [] }))}
              className="text-[10px] text-brand-600 hover:underline font-bold"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {availableBrands.map((brand) => {
            const isChecked = filters.brands.includes(brand);
            const count = getBrandCount(brand);
            const isUnavailable = count === 0 && !isChecked;

            return (
              <button
                key={brand}
                type="button"
                onClick={() => toggleBrand(brand)}
                disabled={isUnavailable}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                  isChecked
                    ? 'bg-brand-50/90 border-brand-500 text-brand-900 font-semibold ring-1 ring-brand-400'
                    : isUnavailable
                    ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed border-dashed'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1 truncate">
                  <span className="truncate">{brand}</span>
                  <span className={`text-[10px] ${isChecked ? 'text-brand-600' : 'text-slate-400'}`}>
                    ({count})
                  </span>
                </div>
                {isChecked && <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* 3. Processor Family Filter with Counts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-brand-600" /> Processor Family
          </label>
          {filters.processors.length > 0 && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, processors: [] }))}
              className="text-[10px] text-brand-600 hover:underline font-bold"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {processorOptions.map((proc) => {
            const isChecked = filters.processors.includes(proc);
            const count = getProcessorCount(proc);
            const isUnavailable = count === 0 && !isChecked;

            return (
              <button
                key={proc}
                type="button"
                onClick={() => toggleProcessor(proc)}
                disabled={isUnavailable}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : isUnavailable
                    ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed border-dashed'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{proc}</span>
                <span className={`text-[10px] ${isChecked ? 'text-brand-100 font-bold' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* 4. RAM Configuration with Reactive Adaptation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-brand-600" /> RAM Memory
          </label>
          {filters.rams.length > 0 && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, rams: [] }))}
              className="text-[10px] text-brand-600 hover:underline font-bold"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ramOptions.map((ram) => {
            const isChecked = filters.rams.includes(ram);
            const count = getRamCount(ram);
            const isUnavailable = count === 0 && !isChecked;

            return (
              <button
                key={ram}
                type="button"
                onClick={() => toggleRam(ram)}
                disabled={isUnavailable}
                className={`py-2 px-1 rounded-xl text-xs font-semibold text-center border transition-all flex flex-col items-center justify-center ${
                  isChecked
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : isUnavailable
                    ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed border-dashed'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{ram} GB</span>
                <span className={`text-[10px] font-normal mt-0.5 ${isChecked ? 'text-brand-100' : 'text-slate-400'}`}>
                  {isUnavailable ? 'Out of stock' : `${count} available`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* 5. Storage (SSD) with Reactive Adaptation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-cyan-600" /> SSD Storage
          </label>
          {filters.storages.length > 0 && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, storages: [] }))}
              className="text-[10px] text-brand-600 hover:underline font-bold"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {storageOptions.map((ssd) => {
            const isChecked = filters.storages.includes(ssd);
            const count = getStorageCount(ssd);
            const isUnavailable = count === 0 && !isChecked;

            return (
              <button
                key={ssd}
                type="button"
                onClick={() => toggleStorage(ssd)}
                disabled={isUnavailable}
                className={`py-2 px-1 rounded-xl text-xs font-semibold text-center border transition-all flex flex-col items-center justify-center ${
                  isChecked
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                    : isUnavailable
                    ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed border-dashed'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{ssd >= 1024 ? '1 TB' : `${ssd} GB`}</span>
                <span className={`text-[10px] font-normal mt-0.5 ${isChecked ? 'text-cyan-100' : 'text-slate-400'}`}>
                  {isUnavailable ? 'Out of stock' : `${count} available`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* 6. Display Screen Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-brand-600" /> Display Size
          </label>
          {filters.screens.length > 0 && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, screens: [] }))}
              className="text-[10px] text-brand-600 hover:underline font-bold"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {screenOptions.map((screen) => {
            const isChecked = filters.screens.includes(screen);
            const count = getScreenCount(screen);
            const isUnavailable = count === 0 && !isChecked;

            return (
              <button
                key={screen}
                type="button"
                onClick={() => toggleScreen(screen)}
                disabled={isUnavailable}
                className={`py-2 px-1 rounded-xl text-xs font-semibold text-center border transition-all flex flex-col items-center justify-center ${
                  isChecked
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : isUnavailable
                    ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed border-dashed'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{screen}"</span>
                <span className={`text-[10px] font-normal mt-0.5 ${isChecked ? 'text-brand-100' : 'text-slate-400'}`}>
                  {isUnavailable ? '0 items' : `${count} items`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* 7. Certified Condition Grade */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-emerald-600" /> Certified Grade
        </label>
        <div className="space-y-1.5">
          {gradeOptions.map((grade) => {
            const isChecked = filters.grades.includes(grade);
            const count = getGradeCount(grade);

            return (
              <label
                key={grade}
                className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-brand-50/60 text-brand-900 font-semibold'
                    : count === 0
                    ? 'text-slate-400 opacity-60 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setFilters(prev => ({
                        ...prev,
                        grades: isChecked
                          ? prev.grades.filter(g => g !== grade)
                          : [...prev.grades, grade]
                      }));
                    }}
                    className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 border-slate-300"
                  />
                  <span>{grade}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
