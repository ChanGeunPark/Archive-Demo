-- 기존 Supabase DB에 image_id 컬럼 추가
-- image-marketplace-flow.sql을 이미 실행한 경우 이 파일만 실행하면 됩니다.

alter table public.marketplace_demo_works
add column if not exists image_id text;
