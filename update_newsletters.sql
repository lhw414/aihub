UPDATE newsletters SET 
  pdfUrl = CASE id
    WHEN 1 THEN '/newsletters/newsletter_01.pdf'
    WHEN 2 THEN '/newsletters/newsletter_02.pdf'
    WHEN 3 THEN '/newsletters/newsletter_03.pdf'
    WHEN 4 THEN '/newsletters/newsletter_04.pdf'
    WHEN 5 THEN '/newsletters/newsletter_05.pdf'
    WHEN 6 THEN '/newsletters/newsletter_06.pdf'
    ELSE pdfUrl
  END,
  pdfThumbnailUrl = CASE id
    WHEN 1 THEN '/newsletter-thumbnails/newsletter_01_thumb.png'
    WHEN 2 THEN '/newsletter-thumbnails/newsletter_02_thumb.png'
    WHEN 3 THEN '/newsletter-thumbnails/newsletter_03_thumb.png'
    WHEN 4 THEN '/newsletter-thumbnails/newsletter_04_thumb.png'
    WHEN 5 THEN '/newsletter-thumbnails/newsletter_05_thumb.png'
    WHEN 6 THEN '/newsletter-thumbnails/newsletter_06_thumb.png'
    ELSE pdfThumbnailUrl
  END
WHERE id BETWEEN 1 AND 6;
