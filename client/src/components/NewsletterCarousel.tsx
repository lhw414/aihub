import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function NewsletterCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: newsletters = [], isLoading } = trpc.newsletter.list.useQuery({ limit: 100 });

  const itemsPerPage = 4;
  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < newsletters.length; i += itemsPerPage) {
      result.push(newsletters.slice(i, i + itemsPerPage));
    }
    return result.length > 0 ? result : [[]];
  }, [newsletters]);

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
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {currentItems.map((item) => (
          <a
            key={item.id}
            href={`/newsletter/${item.id}`}
            className="group cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 block"
          >
            {item.thumbnailUrl && (
              <div className="relative h-32 overflow-hidden">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{item.description}</p>
              )}
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

