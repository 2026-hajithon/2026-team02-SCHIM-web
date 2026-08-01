import { apiRequest } from "../../../utils/apiClient.js";

async function getSurfCards({ cursor, limit = 10, revisit = false } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    revisit: String(revisit),
  });

  if (cursor) {
    params.set("cursor", cursor);
  }

  const response = await apiRequest(`/api/surf?${params}`);

  return {
    items: response.data ?? [],
    nextCursor: response.meta?.nextCursor ?? null,
    hasNext: response.meta?.hasNext ?? false,
  };
}

export default getSurfCards;
