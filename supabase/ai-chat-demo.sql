create table if not exists public.ai_demo_characters (
  id text primary key,
  name text not null,
  role text not null,
  category text not null default 'CHARACTER',
  gender text not null default 'ETC',
  image_url text,
  image_id text,
  banner_image_url text,
  banner_image_id text,
  image_gradient text not null,
  tags text[] not null default '{}',
  description text not null,
  status_message text,
  world_view text not null,
  creator_id text not null default 'admin',
  opening_message text not null,
  seed_chat text[] not null default '{}',
  sample_messages text[] not null default '{}',
  total_chat_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_demo_character_private_configs (
  character_id text primary key references public.ai_demo_characters(id) on delete cascade,
  secret_context text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ai_demo_characters
add column if not exists image_url text;

alter table public.ai_demo_characters
add column if not exists image_id text;

alter table public.ai_demo_characters
add column if not exists banner_image_url text;

alter table public.ai_demo_characters
add column if not exists banner_image_id text;

alter table public.ai_demo_characters
add column if not exists category text not null default 'CHARACTER';

alter table public.ai_demo_characters
add column if not exists gender text not null default 'ETC';

alter table public.ai_demo_characters
add column if not exists status_message text;

alter table public.ai_demo_characters
add column if not exists creator_id text not null default 'admin';

alter table public.ai_demo_characters
add column if not exists seed_chat text[] not null default '{}';

alter table public.ai_demo_character_private_configs
add column if not exists secret_context text not null default '';

create table if not exists public.ai_demo_chat_rooms (
  id text primary key,
  character_id text not null references public.ai_demo_characters(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_demo_chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.ai_demo_chat_rooms(id) on delete cascade,
  character_id text not null references public.ai_demo_characters(id) on delete cascade,
  role text not null check (role in ('human', 'ai')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.ai_demo_characters enable row level security;
alter table public.ai_demo_character_private_configs enable row level security;
alter table public.ai_demo_chat_rooms enable row level security;
alter table public.ai_demo_chat_messages enable row level security;

drop policy if exists "public can read demo characters"
on public.ai_demo_characters;

create policy "public can read demo characters"
on public.ai_demo_characters
for select
to anon
using (true);

create index if not exists ai_demo_chat_rooms_character_id_idx
on public.ai_demo_chat_rooms(character_id);

create index if not exists ai_demo_chat_messages_room_id_created_at_idx
on public.ai_demo_chat_messages(room_id, created_at);

create or replace function public.set_ai_demo_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_ai_demo_chat_rooms_updated_at
on public.ai_demo_chat_rooms;

create trigger set_ai_demo_chat_rooms_updated_at
before update on public.ai_demo_chat_rooms
for each row
execute function public.set_ai_demo_updated_at();

drop trigger if exists set_ai_demo_character_private_configs_updated_at
on public.ai_demo_character_private_configs;

create trigger set_ai_demo_character_private_configs_updated_at
before update on public.ai_demo_character_private_configs
for each row
execute function public.set_ai_demo_updated_at();

insert into public.ai_demo_characters (
  id,
  name,
  role,
  category,
  gender,
  image_url,
  image_id,
  banner_image_url,
  banner_image_id,
  image_gradient,
  tags,
  description,
  status_message,
  world_view,
  creator_id,
  opening_message,
  seed_chat,
  sample_messages,
  total_chat_count
) values
(
  'raina-archivist',
  '레이나',
  '기록을 해석하는 아카이브 큐레이터',
  'CHARACTER',
  'FEMALE',
  null,
  null,
  null,
  null,
  'from-[#FFE55C] via-[#FFBF5C] to-[#FF8F5C]',
  array['아카이브', '차분함', '분석'],
  '흩어진 대화와 장면의 의미를 정리해 주는 캐릭터입니다.',
  '기록을 정리하는 중',
  '레이나는 오래된 대화 기록을 보관하는 디지털 아카이브의 큐레이터입니다.',
  'admin',
  '어서 와요. 오늘은 어떤 장면을 다시 꺼내 볼까요?',
  array[]::text[],
  array['이전 대화에서 중요한 감정 변화를 찾아줘.', '캐릭터가 망설였던 이유를 다시 설명해줘.', '이 장면을 포트폴리오용으로 요약해줘.'],
  12840
),
(
  'noel-detective',
  '노엘',
  '단서를 모으는 사건 기록자',
  'PERSON',
  'MALE',
  null,
  null,
  null,
  null,
  'from-[#CCE6FF] via-[#5CADFF] to-[#0079F2]',
  array['추리', '서사', '긴장감'],
  '대화 속 단서와 모순을 찾아 다음 전개를 제안합니다.',
  '사건 기록 열람 가능',
  '노엘은 도시의 이상한 사건들을 채팅 로그로 추적합니다.',
  'admin',
  '기록은 거짓말을 못 해. 지금 남아 있는 문장부터 살펴보자.',
  array[]::text[],
  array['방금 대화에서 단서가 될 만한 부분은 뭐야?', '다음 장면을 미스터리 톤으로 이어줘.', '사용자 선택지를 세 가지 만들어줘.'],
  9420
),
(
  'mika-stage',
  '미카',
  '무대 뒤 감정을 읽는 캐릭터',
  'FICTIONAL',
  'FEMALE',
  null,
  null,
  null,
  null,
  'from-[#A7F6E2] via-[#33EBBD] to-[#14CC9E]',
  array['감정', '로맨스', '회상'],
  '캐릭터의 말투와 속마음을 살려 대화를 이어갑니다.',
  '커튼콜 이후',
  '미카는 공연이 끝난 뒤에도 무대의 여운을 듣습니다.',
  'admin',
  '조명이 꺼진 뒤에야 진짜 이야기가 시작되잖아.',
  array[]::text[],
  array['조금 더 다정한 톤으로 답해줘.', '캐릭터의 속마음을 행동 묘사로 보여줘.', '방금 답변을 짧은 채팅 말투로 바꿔줘.'],
  7312
)
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  category = excluded.category,
  gender = excluded.gender,
  image_url = excluded.image_url,
  image_id = excluded.image_id,
  banner_image_url = excluded.banner_image_url,
  banner_image_id = excluded.banner_image_id,
  image_gradient = excluded.image_gradient,
  tags = excluded.tags,
  description = excluded.description,
  status_message = excluded.status_message,
  world_view = excluded.world_view,
  creator_id = excluded.creator_id,
  opening_message = excluded.opening_message,
  seed_chat = excluded.seed_chat,
  sample_messages = excluded.sample_messages,
  total_chat_count = excluded.total_chat_count;
