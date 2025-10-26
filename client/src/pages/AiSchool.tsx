import { ArrowLeft, BookOpen, Users, Award } from "lucide-react";

export default function AiSchool() {
  const courses = [
    {
      title: "AI 기초 과정",
      description: "AI와 머신러닝의 기본 개념을 학습합니다.",
      level: "초급",
      duration: "4주",
    },
    {
      title: "딥러닝 심화",
      description: "신경망과 딥러닝 모델을 깊이 있게 학습합니다.",
      level: "중급",
      duration: "6주",
    },
    {
      title: "자연어 처리",
      description: "NLP 기술과 언어 모델을 배웁니다.",
      level: "중급",
      duration: "5주",
    },
    {
      title: "컴퓨터 비전",
      description: "이미지 처리와 객체 인식 기술을 학습합니다.",
      level: "중급",
      duration: "5주",
    },
    {
      title: "생성형 AI",
      description: "최신 생성형 AI 기술을 배웁니다.",
      level: "고급",
      duration: "4주",
    },
    {
      title: "AI 프로젝트 실전",
      description: "실제 프로젝트를 통해 AI를 적용합니다.",
      level: "고급",
      duration: "8주",
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">AI 스쿨</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">AI 기술을 배우세요</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            삼성리서치의 전문가들과 함께 AI의 미래를 만들어가세요.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">체계적인 커리큘럼</h3>
            <p className="text-gray-600">
              기초부터 고급까지 단계별로 구성된 교육 과정
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">전문가 강사진</h3>
            <p className="text-gray-600">
              삼성리서치의 경험 많은 AI 전문가들의 직접 강의
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">수료증 발급</h3>
            <p className="text-gray-600">
              과정 완료 후 공식 수료증 발급
            </p>
          </div>
        </div>

        {/* Courses */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">모든 과정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">
                    {course.title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold ml-2">
                    {course.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    {course.duration}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">지금 등록하세요</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            AI 기술의 미래를 함께 만들어갈 인재를 찾고 있습니다.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition">
            강좌 신청하기
          </button>
        </div>
      </div>
    </div>
  );
}

