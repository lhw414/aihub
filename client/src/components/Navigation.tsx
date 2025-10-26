import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";

interface NavItem {
  label: string;
  items: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "AI App",
    items: [
      { label: "AI 서비스 목록", href: "/" },
      { label: "API 문서", href: "https://api.example.com/docs" },
      { label: "개발자 포털", href: "https://dev.example.com" },
      { label: "SDK 다운로드", href: "https://sdk.example.com/download" },
    ],
  },
  {
    label: "AI 스쿨",
    items: [
      { label: "강좌 목록", href: "/school" },
      { label: "학습 자료", href: "https://learn.example.com" },
      { label: "커뮤니티", href: "https://forum.example.com" },
      { label: "웨비나", href: "https://webinar.example.com" },
    ],
  },
  {
    label: "FAQ",
    items: [
      { label: "자주 묻는 질문", href: "/faq" },
      { label: "기술 지원", href: "https://support.example.com" },
      { label: "문의하기", href: "https://contact.example.com" },
      { label: "피드백", href: "https://feedback.example.com" },
    ],
  },
];

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
          {APP_LOGO && (
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
          )}
          <span className="text-xl font-bold text-gray-900">{APP_TITLE}</span>
        </a>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition flex items-center gap-1 rounded-lg hover:bg-gray-100">
                {item.label}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {item.items.map((subItem) => (
                  <a
                    key={subItem.label}
                    href={subItem.href}
                    target={subItem.href.startsWith("http") ? "_blank" : undefined}
                    rel={subItem.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {subItem.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

