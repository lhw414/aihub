import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { HelpCircle } from "lucide-react";

export default function QuickLinksSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { data: categoriesWithLinks = [], isLoading } = trpc.quickLink.listWithCategories.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categoriesWithLinks.map((category) => (
        <div key={category.id}>
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
            {category.name}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {category.links.map((link) => (
              <div
                key={link.id}
                className="relative group"
                onMouseEnter={() => setHoveredId(link.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <a
                  href={link.linkUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-gray-700 font-medium text-xs transition-all duration-200 flex items-center justify-center gap-1 border border-blue-200 hover:border-blue-400 group-hover:shadow-md"
                >
                  {link.iconUrl && (
                    <img src={link.iconUrl} alt="" className="w-4 h-4" />
                  )}
                  <span className="line-clamp-1">{link.title}</span>
                </a>

                {/* Tooltip */}
                {link.description && hoveredId === link.id && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 whitespace-normal">
                    {link.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {categoriesWithLinks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">퀵링크가 없습니다</p>
        </div>
      )}
    </div>
  );
}

