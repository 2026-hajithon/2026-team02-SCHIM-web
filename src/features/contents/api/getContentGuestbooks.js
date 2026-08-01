import { apiRequest } from "../../../utils/apiClient.js";

async function getContentGuestbooks({ contentId, cursor, limit = 20 }) {
  const params = new URLSearchParams({ limit: String(limit) });

  if (cursor) {
    params.set("cursor", cursor);
  }

  const response = await apiRequest(
    `/api/contents/${encodeURIComponent(contentId)}/guestbooks?${params}`,
  );

  return {
    items: response.data ?? [],
    nextCursor: response.meta?.nextCursor ?? null,
    hasNext: response.meta?.hasNext ?? false,
  };
}

export default getContentGuestbooks;
