import { useState } from "react";
import { useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PdfViewer from "@/components/PdfViewer";

export default function NewsletterDetail() {
  const [, params] = useRoute("/newsletter/:id");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const id = params?.id ? parseInt(params.id, 10) : null;

  const { data: newsletter, isLoading } = trpc.newsletter.getById.useQuery(
    { id: id || 0 },
    { enabled: !!id }
  );

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">유효하지 않은 뉴스레터입니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">뉴스레터를 찾을 수 없습니다.</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">{newsletter.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Newsletter Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Thumbnail */}
              <div className="md:col-span-1">
                {newsletter.pdfThumbnailUrl && (
                  <div className="rounded-lg overflow-hidden shadow-md mb-4">
                    <img
                      src={newsletter.pdfThumbnailUrl}
                      alt={newsletter.title}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                {newsletter.pdfUrl && (
                  <button
                    onClick={() => setShowPdfViewer(true)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    PDF 보기
                  </button>
                )}
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      설명
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {newsletter.description || "설명이 없습니다."}
                    </p>
                  </div>

                  {newsletter.linkUrl && (
                    <div>
                      <a
                        href={newsletter.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        더 알아보기
                      </a>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      발행일: {new Date(newsletter.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Newsletters */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">다른 뉴스레터</h2>
            <p className="text-gray-500 text-center py-8">
              다른 뉴스레터를 보려면 메인 페이지로 돌아가세요.
            </p>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && newsletter.pdfUrl && (
        <PdfViewer
          pdfUrl={newsletter.pdfUrl}
          title={newsletter.title}
          onClose={() => setShowPdfViewer(false)}
        />
      )}
    </div>
  );
}

