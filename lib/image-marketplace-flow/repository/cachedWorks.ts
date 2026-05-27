import { cache } from "react";

import { getWorkById } from "./works";

/** 요청당 generateMetadata + page에서 getWorkById 중복 호출 방지 */
export const getCachedWorkById = cache(getWorkById);
