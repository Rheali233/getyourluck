-- 为详细反馈表增加 images_json 字段，用于存储图片 key/URL 数组（JSON 序列化字符串）
ALTER TABLE user_feedback_details ADD COLUMN images_json TEXT;

