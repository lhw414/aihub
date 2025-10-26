-- AI App 카테고리에 app1, app2, app3 추가
INSERT INTO quickLinks (categoryId, title, description, linkUrl, order) VALUES
(1, 'App 1', 'AI 기반 텍스트 분석 도구', 'https://app1.example.com', 4),
(1, 'App 2', 'AI 이미지 처리 서비스', 'https://app2.example.com', 5),
(1, 'App 3', 'AI 음성 인식 솔루션', 'https://app3.example.com', 6);

-- AI 스쿨 카테고리에 실라버스, 수강신청 추가
INSERT INTO quickLinks (categoryId, title, description, linkUrl, order) VALUES
(2, '실라버스', '강좌 커리큘럼 및 학습 계획', 'https://syllabus.example.com', 4),
(2, '수강신청', '강좌에 등록하고 학습 시작', 'https://enroll.example.com', 5);

-- FAQ 카테고리에 자주 묻는 질문, 커뮤니티 추가
INSERT INTO quickLinks (categoryId, title, description, linkUrl, order) VALUES
(3, '자주 묻는 질문', '일반적인 질문과 답변 모음', 'https://faq.example.com', 3),
(3, '커뮤니티', '사용자 커뮤니티 및 토론 포럼', 'https://community.example.com', 4);
