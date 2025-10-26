UPDATE quickLinks SET linkUrl = CASE id
  WHEN 1 THEN 'https://api.example.com/docs'
  WHEN 2 THEN 'https://sdk.example.com/download'
  WHEN 3 THEN 'https://github.com/example/samples'
  WHEN 4 THEN 'https://learn.example.com/tutorial'
  WHEN 5 THEN 'https://webinar.example.com'
  WHEN 6 THEN 'https://docs.example.com'
  WHEN 7 THEN 'https://forum.example.com'
  WHEN 8 THEN 'https://github.com/example'
  WHEN 9 THEN 'https://github.com/example/issues'
  ELSE linkUrl
END;
