import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AiAppCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: aiApps = [], isLoading } = trpc.aiApp.list.useQuery({ limit: 100 });

  const itemsPerPage = 3;
  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < aiApps.length; i += itemsPerPage) {
      result.push(aiApps.slice(i, i + itemsPerPage));
    }
    return result.length > 0 ? result : [[]];
  }, [aiApps]);

  const currentItems = pages[currentPage] || [];
  const maxPages = pages.length;

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {currentItems.map((item) => (
          <a
            key={item.id}
            href={`/app/${item.id}`}
            className="group cursor-pointer rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100 hover:border-blue-300 block"
          >
            {item.thumbnailUrl && (
              <div className="relative h-40 overflow-hidden bg-gray-200">
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{item.description}</p>
              )}
              <button className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                자세히 보기
              </button>
            </div>
          </a>
        ))}
      </div>

      {/* Navigation Controls */}
      {maxPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPage ? "bg-blue-600 w-8" : "bg-gray-300"
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

