import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import NewsletterCarousel from "@/components/NewsletterCarousel";
import AiAppCarousel from "@/components/AiAppCarousel";
import QuickLinksSection from "@/components/QuickLinksSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navigation />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Newsletters and AI Apps */}
            <div className="lg:col-span-2 space-y-12">
              {/* AI Newsletters Section */}
              <section className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">AI 뉴스레터</h2>
                  <p className="text-gray-600">최신 AI 관련 뉴스와 인사이트를 만나보세요</p>
                </div>
                <NewsletterCarousel />
              </section>

              {/* AI Apps Section */}
              <section className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">AI 앱</h2>
                  <p className="text-gray-600">삼성리서치의 AI 서비스들을 경험해보세요</p>
                </div>
                <AiAppCarousel />
              </section>
            </div>

            {/* Right Column - Quick Links */}
            <div className="lg:col-span-1">
              <section className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 hover:shadow-xl transition-shadow duration-300">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">퀵링크</h2>
                  <p className="text-gray-600 text-sm">자주 사용하는 링크들</p>
                </div>
                <QuickLinksSection />
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">AI Hub</h3>
              <p className="text-gray-400 text-sm">삼성리서치의 AI 서비스 플랫폼</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">AI 앱</a></li>
                <li><a href="#" className="hover:text-white transition">AI 스쿨</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">문의하기</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">소개</a></li>
                <li><a href="#" className="hover:text-white transition">블로그</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-sm text-center">© 2025 Samsung Research. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

