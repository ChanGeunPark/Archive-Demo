/**
 * 마켓플레이스 데모의 Supabase 데이터 접근 계층.
 *
 * DB row ↔ GraphQL 도메인 타입 변환을 담당합니다.
 * 환경 변수가 없거나 쿼리가 실패하면 빈 배열/null을 반환하고 콘솔에 경고를 남깁니다.
 */
export type {
  CreateWorkInput,
  ListCreatorWorksOptions,
  ListRandomWorksOptions,
  ListWorksByUserIdOptions,
  ListWorksOptions,
  SearchByKeywordResult,
  WorkEdge,
  WorksConnection,
  WorksPageInfo,
} from "./types";

export { searchByKeyword } from "./search";
export {
  listWorks,
  listCreatorWorks,
  listWorksByUserId,
  listRandomWorks,
  createWork,
  getWorkById,
  updateAskingPrice,
  deleteWork,
} from "./works";
export { getUserById, getUserByHandle, updateUserAvatar } from "./users";
export { createOffer, acceptOffer } from "./offers";
export { buyWork } from "./transactions";
