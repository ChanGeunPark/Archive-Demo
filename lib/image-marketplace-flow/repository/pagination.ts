import type { WorksConnection } from "./types";

type WorkCursorPayload = {
  createdAt: string;
  id: string;
};

export function encodeWorkCursor(createdAt: string, id: string): string {
  return Buffer.from(
    JSON.stringify({ createdAt, id } satisfies WorkCursorPayload),
  ).toString("base64url");
}

export function decodeWorkCursor(cursor: string): WorkCursorPayload | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8"),
    ) as Partial<WorkCursorPayload>;

    if (
      typeof parsed.createdAt === "string" &&
      typeof parsed.id === "string"
    ) {
      return { createdAt: parsed.createdAt, id: parsed.id };
    }
  } catch {
    // invalid cursor
  }

  return null;
}

export function emptyWorksConnection(): WorksConnection {
  return {
    edges: [],
    pageInfo: { hasNextPage: false, endCursor: null },
    totalCount: null,
  };
}
