# Archive Demo

공개 저장소로 보여주기 어려운 회사 프로젝트 경험을, 직접 실행할 수 있는 포트폴리오 데모로 다시 설계한 아카이브입니다.

실제 업무에서는 서비스 코드, 도메인, 데이터, 외부 API 의존성을 그대로 공개할 수 없습니다. 그래서 이 프로젝트는 회사 코드나 비공개 자산을 옮긴 것이 아니라, 업무에서 다뤘던 문제와 흐름을 공개 가능한 형태로 다시 구현한 데모입니다.

단순한 화면 캡처 모음이 아니라, 사용자가 직접 진입해 기능 흐름을 확인할 수 있는 작은 서비스 묶음을 목표로 했습니다. 현재는 AI 캐릭터 채팅 플로우와 이미지 마켓플레이스 플로우, 두 개의 독립적인 데모를 한 Next.js 레포 안에서 관리합니다.

## 왜 한 레포에 두 프로젝트를 두었나

두 데모는 같은 포트폴리오 목적을 공유하지만, 보여주고 싶은 역량의 방향이 다릅니다.

- `character-chat-replay`: 생성형 AI 채팅, SSE 스트리밍, BFF, 대화 히스토리 저장
- `image-marketplace-flow`: 마켓플레이스 탐색, 구매/제안 상태 전환, GraphQL, Apollo cache, Realtime

별도 레포로 나누면 각 프로젝트의 맥락은 선명해지지만, 포트폴리오를 보는 입장에서는 실행 방법과 환경 설정이 반복됩니다. 그래서 하나의 Next.js 앱 안에 두 데모를 넣고, 라우트와 도메인 폴더를 분리해 각각 독립 프로젝트처럼 볼 수 있게 구성했습니다.

## Global Components를 많이 쓰지 않은 이유

이 레포에는 두 개의 데모가 함께 있지만, 의도적으로 공통 UI 컴포넌트화를 크게 밀어붙이지 않았습니다.

각 데모는 실제로 서로 다른 제품을 재구성한 것이고, 화면 밀도, 인터랙션, 상태 관리 방식, 디자인 톤이 다릅니다. 공통 컴포넌트를 무리하게 늘리면 데모별 맥락보다 추상화가 먼저 보이고, 작은 포트폴리오 프로젝트에서 오히려 읽기 어려운 코드가 될 수 있다고 판단했습니다.

그래서 `Typography`, 일부 아이콘, provider처럼 앱 전체에서 의미가 분명한 최소 단위만 공유하고, 버튼, 카드, 레이아웃, 도메인 UI는 각 데모 폴더 안에서 따로 관리했습니다. 이 구조는 중복을 완전히 없애는 것보다, 각 프로젝트의 구현 의도와 업무 맥락을 독립적으로 읽기 쉽게 만드는 쪽에 초점을 둡니다.

## Demo List

### AI Character Chat Replay

캐릭터 선택부터 채팅방 진입, 스트리밍 응답, 대화 히스토리 저장까지 이어지는 AI 채팅 데모입니다. 실서비스에서 다뤘던 AI 채팅 플로우를 공개 가능한 구조로 줄이고, REST API와 TanStack Query 기반으로 다시 구성했습니다.

- 캐릭터 목록, 상세 미리보기, 채팅방 진입
- 캐릭터 생성 플로우와 미리 대화 기능
- Next.js API Route 기반 BFF
- LangChain 기반 GPT/Gemini 응답 생성
- SSE 스트리밍과 smooth reveal UX
- Supabase 기반 캐릭터/채팅 히스토리 저장
- API 키가 없어도 확인 가능한 mock fallback

간단한 기술 노트:

- 브라우저에는 API key, 시스템 프롬프트, 비공개 캐릭터 설정을 노출하지 않고 BFF에서 처리합니다.
- 같은 `roomId`의 연속 대화는 in-memory session으로 히스토리 재사용을 재현했습니다.
- provider마다 다른 SSE chunk 단위를 화면에서는 비슷한 타이핑 경험으로 보이도록 smooth reveal 레이어를 두었습니다.
- 자세한 내용은 `/demos/character-chat-replay/technical-notes`에서 확인할 수 있습니다.

### Image Marketplace Flow

이미지 작품을 탐색하고, 등록하고, 구매하고, 가격 제안을 보내는 마켓플레이스 플로우 데모입니다. CHIZU 마켓플레이스에서 다뤘던 Discover, 작품 상세, 구매, 가격 제안, 등록 흐름을 Web3 의존성 없이 Supabase와 자체 GraphQL API로 재구성했습니다.

- Discover 목록과 masonry grid
- 작품 상세, 구매, 가격 제안, 삭제
- ID 기반 데모 로그인
- 작품 등록과 Cloudflare Images 업로드
- GraphQL Yoga 기반 자체 marketplace API
- Apollo `fetchMore`와 cache merge 기반 cursor pagination
- Supabase Realtime 기반 상세 화면 갱신

간단한 기술 노트:

- 이미지 로드 전 카드 높이 예측 문제는 CSS `aspect-ratio`로 풀어 Masonry CLS를 줄였습니다.
- Discover 목록은 Apollo `typePolicies.merge`로 페이지를 누적하고, 상세에서 뒤로 돌아왔을 때 이전 목록과 스크롤 위치를 복원합니다.
- Realtime payload를 화면 상태로 직접 쓰지 않고, “다시 조회가 필요하다”는 트리거로만 사용해 서버 기준 거래 정합성을 유지합니다.
- 자세한 내용은 `/demos/image-marketplace-flow/technical-notes`에서 확인할 수 있습니다.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- Apollo Client / GraphQL Yoga
- Supabase
- LangChain
- OpenAI / Gemini
- Cloudflare Images

## Project Structure

```txt
app/
  demos/
    character-chat-replay/       # AI 캐릭터 채팅 데모
    image-marketplace-flow/      # 이미지 마켓플레이스 데모
  api/
    ai-chat-demo/                # AI 채팅 데모 API Routes
    marketplace/                 # 마켓플레이스 GraphQL/upload/delete API
components/
  typography/                    # 최소 공통 Typography
  icons/                         # 공통 아이콘
lib/
  ai-chat-demo/                  # AI 채팅 도메인 타입, repository, generator, hooks
  image-marketplace-flow/        # 마켓플레이스 repository, GraphQL, Apollo, Realtime
  cloudflare/                    # Cloudflare Images 연동
  supabase/                      # Supabase client/type
providers/                       # 앱 전역 provider
supabase/                        # 데모용 DB schema
```

## Getting Started

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 데모 인덱스를 확인할 수 있습니다.

주요 경로:

- `/demos/character-chat-replay`
- `/demos/character-chat-replay/technical-notes`
- `/demos/image-marketplace-flow`
- `/demos/image-marketplace-flow/technical-notes`

## Environment Variables

필수 환경변수가 없어도 일부 기능은 mock 데이터나 fallback으로 확인할 수 있습니다. 실제 AI 응답, DB 저장, 이미지 업로드, Realtime 갱신까지 확인하려면 아래 값을 설정합니다.

### Supabase

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SECRET_KEY`도 service role key 대체 값으로 사용할 수 있습니다.

### AI Chat Model Provider

GPT를 사용할 경우:

```bash
AI_CHAT_MODEL_PROVIDER=gpt
OPENAI_API_KEY=your-openai-key
LANGCHAIN_OPENAI_MODEL=gpt-4o-mini
```

Gemini를 사용할 경우:

```bash
AI_CHAT_MODEL_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
AI_CHAT_GEMINI_MODEL=gemini-2.5-flash
```

`GOOGLE_API_KEY`도 Gemini API key 대체 값으로 사용할 수 있습니다. 선택한 provider의 API key가 없으면 로컬 mock 응답으로 fallback됩니다.

### Cloudflare Images

이미지 업로드/삭제 기능을 확인하려면 설정합니다.

```bash
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_IMAGES_API_TOKEN=your-cloudflare-images-token
```

### Optional

```bash
AI_DEMO_ADMIN_ID=admin
AI_CHAT_SESSION_TTL_MS=43200000
AI_CHAT_SESSION_HISTORY_LIMIT=16
AI_CHAT_DEBUG_PROMPT=false
```

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # production server
npm run lint    # eslint
```

## Portfolio Note

이 저장소는 실제 회사 코드, 비공개 데이터, 내부 API, 유료/비공개 자산을 포함하지 않습니다. 업무에서 경험한 문제를 바탕으로 유사한 흐름을 다시 설계하고, 공개 가능한 스택과 샘플 데이터로 재구현한 포트폴리오 프로젝트입니다.

## License

Portfolio demo project. All company-specific code, assets, and data are excluded.
