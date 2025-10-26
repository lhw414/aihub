-- AI 뉴스레터 데이터
INSERT INTO newsletters (title, description, thumbnailUrl, linkUrl, `order`) VALUES
('AI 기술 트렌드 2025', 'AI 산업의 최신 기술 트렌드와 전망', 'https://via.placeholder.com/300x200?text=AI+Trend', '#', 1),
('머신러닝 최적화 팁', '머신러닝 모델 최적화를 위한 실용적인 팁', 'https://via.placeholder.com/300x200?text=ML+Tips', '#', 2),
('딥러닝 아키텍처 비교', '최신 딥러닝 아키텍처들의 성능 비교', 'https://via.placeholder.com/300x200?text=DL+Architecture', '#', 3),
('자연어 처리 발전', 'NLP 분야의 최근 발전과 응용사례', 'https://via.placeholder.com/300x200?text=NLP', '#', 4),
('컴퓨터 비전 활용', '컴퓨터 비전 기술의 실제 활용 사례', 'https://via.placeholder.com/300x200?text=Vision', '#', 5),
('AI 윤리와 안전', 'AI 개발 시 고려해야 할 윤리 문제', 'https://via.placeholder.com/300x200?text=Ethics', '#', 6);

-- AI App 데이터
INSERT INTO aiApps (name, description, thumbnailUrl, linkUrl, `order`) VALUES
('이미지 분석 AI', '고급 이미지 인식 및 분석 서비스', 'https://via.placeholder.com/300x200?text=Image+AI', '#', 1),
('텍스트 생성 AI', '자연스러운 텍스트 생성 및 번역 서비스', 'https://via.placeholder.com/300x200?text=Text+AI', '#', 2),
('음성 인식 AI', '정확한 음성 인식 및 처리 서비스', 'https://via.placeholder.com/300x200?text=Voice+AI', '#', 3),
('데이터 분석 AI', '빅데이터 분석 및 인사이트 제공', 'https://via.placeholder.com/300x200?text=Data+AI', '#', 4),
('예측 분석 AI', '시계열 데이터 예측 및 분석', 'https://via.placeholder.com/300x200?text=Predict+AI', '#', 5),
('추천 시스템 AI', '개인화된 추천 알고리즘 서비스', 'https://via.placeholder.com/300x200?text=Recommend+AI', '#', 6);

-- 퀵링크 카테고리 데이터
INSERT INTO quickLinkCategories (name, `order`) VALUES
('개발 도구', 1),
('학습 자료', 2),
('커뮤니티', 3);

-- 퀵링크 데이터
INSERT INTO quickLinks (categoryId, title, description, linkUrl, `order`) VALUES
-- 개발 도구
(1, 'API 문서', 'AI Hub API 전체 문서', '#', 1),
(1, 'SDK 다운로드', '각 언어별 SDK 다운로드', '#', 2),
(1, '코드 샘플', '실제 사용 예제 모음', '#', 3),
-- 학습 자료
(2, '튜토리얼', '단계별 학습 가이드', '#', 1),
(2, '웨비나', '전문가 강의 및 세미나', '#', 2),
(2, '문서', '상세한 기술 문서', '#', 3),
-- 커뮤니티
(3, '포럼', '사용자 커뮤니티 포럼', '#', 1),
(3, '깃허브', 'GitHub 저장소', '#', 2),
(3, '이슈 추적', '버그 리포트 및 기능 요청', '#', 3);
