import { useRoute } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AiAppDetail() {
  const [, params] = useRoute("/app/:id");
  const id = params?.id ? parseInt(params.id, 10) : null;

  const { data: app, isLoading } = trpc.aiApp.getById.useQuery(
    { id: id || 0 },
    { enabled: !!id }
  );

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">유효하지 않은 앱입니다.</p>
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

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">앱을 찾을 수 없습니다.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* App Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Thumbnail */}
              <div className="md:col-span-1">
                {app.thumbnailUrl && (
                  <div className="rounded-lg overflow-hidden shadow-md mb-6">
                    <img
                      src={app.thumbnailUrl}
                      alt={app.name}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                {app.linkUrl && (
                  <a
                    href={app.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <span>앱 열기</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      설명
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {app.description || "설명이 없습니다."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        앱 이름
                      </h3>
                      <p className="text-gray-900 font-medium">{app.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        출시일
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {new Date(app.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 기능</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">고급 AI 기술</h3>
                <p className="text-gray-700 text-sm">
                  최신 AI 기술을 활용한 정확하고 빠른 처리
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-gray-900 mb-2">사용자 친화적</h3>
                <p className="text-gray-700 text-sm">
                  직관적인 인터페이스로 누구나 쉽게 사용 가능
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">빠른 성능</h3>
                <p className="text-gray-700 text-sm">
                  최적화된 알고리즘으로 빠른 결과 제공
                </p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="font-semibold text-gray-900 mb-2">신뢰성</h3>
                <p className="text-gray-700 text-sm">
                  삼성리서치의 검증된 기술로 높은 신뢰성 보장
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">지금 바로 시작하세요</h2>
            <p className="text-blue-100 mb-6">
              {app.name}을(를) 통해 AI의 강력한 기능을 경험해보세요.
            </p>
            {app.linkUrl && (
              <a
                href={app.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition"
              >
                앱 접속하기
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

