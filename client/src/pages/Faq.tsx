import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "AI Hub는 무엇인가요?",
    answer:
      "AI Hub는 삼성리서치에서 제공하는 AI 기술 플랫폼으로, 다양한 AI 서비스와 교육 자료를 한 곳에서 제공합니다.",
  },
  {
    question: "AI 앱을 어떻게 사용하나요?",
    answer:
      "각 AI 앱의 상세 페이지에서 '앱 열기' 버튼을 클릭하면 해당 서비스를 이용할 수 있습니다. 자세한 사용 방법은 API 문서를 참고하세요.",
  },
  {
    question: "뉴스레터는 어떻게 구독하나요?",
    answer:
      "메인 페이지의 AI 뉴스레터 섹션에서 최신 뉴스레터를 확인할 수 있습니다. 각 뉴스레터를 클릭하면 PDF 형식으로 전체 내용을 볼 수 있습니다.",
  },
  {
    question: "AI 스쿨 과정은 무료인가요?",
    answer:
      "AI 스쿨의 기본 과정은 무료로 제공됩니다. 고급 과정의 경우 별도의 등록이 필요할 수 있습니다.",
  },
  {
    question: "기술 지원은 어떻게 받나요?",
    answer:
      "기술 관련 문제는 FAQ 섹션의 기술 지원 링크를 통해 문의할 수 있습니다. 전문가 팀이 신속하게 도와드립니다.",
  },
  {
    question: "API를 사용하려면 어떻게 해야 하나요?",
    answer:
      "API 문서 페이지에서 상세한 가이드를 확인할 수 있습니다. API 키 발급은 개발자 포털에서 신청하면 됩니다.",
  },
  {
    question: "개인정보는 어떻게 보호되나요?",
    answer:
      "AI Hub는 업계 최고 수준의 보안 표준을 준수하며, 모든 개인정보는 암호화되어 안전하게 보관됩니다.",
  },
  {
    question: "피드백을 어떻게 제출하나요?",
    answer:
      "페이지 하단의 피드백 폼을 통해 의견을 제출할 수 있습니다. 여러분의 의견은 서비스 개선에 큰 도움이 됩니다.",
  },
];

export default function Faq() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <a
            href="/"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-2xl font-bold text-gray-900">자주 묻는 질문</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">도움이 필요하신가요?</h2>
          <p className="text-blue-100">
            자주 묻는 질문에 대한 답변을 확인하세요.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900 text-left">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedId === idx ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedId === idx && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-blue-50 rounded-2xl shadow-lg p-8 text-center border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              더 궁금한 점이 있으신가요?
            </h3>
            <p className="text-gray-600 mb-6">
              위의 답변에서 찾을 수 없는 내용이 있다면 언제든지 문의해주세요.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

