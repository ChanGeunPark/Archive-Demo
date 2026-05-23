## Archive Demo

회사 프로젝트는 대부분 외부에 공개할 수 있는 링크나 저장소가 없기 때문에, 실제 업무에서 다뤘던 흐름과 UI/UX를 포트폴리오용 데모로 재구성한 프로젝트입니다.

단순히 화면 이미지를 나열하는 대신, 사용자가 직접 진입해서 기능 흐름을 확인할 수 있는 작은 데모 아카이브를 목표로 합니다. 각 데모는 실제 서비스에서 자주 다루는 상태 관리, API 연동, 비동기 처리, 데이터 저장, 생성형 AI 연동 같은 요소를 독립적으로 보여줄 수 있도록 구성하고 있습니다.

## Demo List

### AI Character Chat Replay Demo

캐릭터 선택부터 채팅방 진입, 스트리밍 응답, 대화 히스토리 저장까지 이어지는 AI 채팅 데모입니다.

- 캐릭터 목록 및 상세 미리보기
- 캐릭터 생성 플로우
- GPT 또는 Gemini 기반 채팅 응답
- Supabase 기반 캐릭터/채팅 히스토리 저장
- API 키가 없을 때도 확인 가능한 mock fallback

### Image Marketplace Flow Demo

이미지 탐색, 라이선스 선택, 구매 플로우를 보여주기 위한 데모입니다. 현재는 데모 슬롯만 준비되어 있으며 이후 확장 예정입니다.

## Tech Stack

- [Next.js](https://nextjs.org) 16 App Router
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) 4
- [TanStack Query](https://tanstack.com/query/latest)
- [Supabase](https://supabase.com)
- [LangChain](https://www.langchain.com)
- OpenAI / Gemini
- Cloudflare Images

## Project Structure

```txt
app/
  demos/                         # 포트폴리오 데모 화면
    character-chat-replay/       # AI 캐릭터 채팅 데모
    image-marketplace-flow/      # 이미지 마켓플레이스 데모
  api/
    ai-chat-demo/                # 캐릭터 채팅 데모 API
lib/
  ai-chat-demo/                  # 도메인 타입, repository, AI generator, client hooks
  cloudflare/                    # Cloudflare Images 연동
  supabase/                      # Supabase admin client
providers/                       # 앱 전역 provider
supabase/                        # 데모용 DB schema
```

## Getting Started

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 데모 인덱스를 확인할 수 있습니다.

## Environment Variables

필수 환경변수가 없어도 일부 데모는 mock 데이터로 동작하도록 구성되어 있습니다. 실제 AI 응답, 이미지 업로드, DB 저장까지 확인하려면 아래 값들을 설정합니다.

### Supabase

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
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

캐릭터 이미지 업로드/삭제 기능을 확인하려면 설정합니다.

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

이 저장소는 실제 회사 코드나 비공개 데이터를 포함하지 않습니다. 공개할 수 없는 업무 경험을 바탕으로, 유사한 문제를 데모 형태로 다시 설계하고 구현한 포트폴리오용 프로젝트입니다.

## Roadmap

- AI Character Chat Replay Demo 완성도 개선
- Image Marketplace Flow Demo 구현
- 데모별 README 또는 상세 기술 노트 추가
- 배포 환경에서 확인 가능한 샘플 데이터 정리

## License

Portfolio demo project. All company-specific code, assets, and data are excluded.
