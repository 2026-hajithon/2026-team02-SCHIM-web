import { apiRequest } from "../../../utils/apiClient.js";
import { toApiCategory } from "./category.js";

async function searchContents({ keyword, category, page = 1, size = 20 }) {
  const params = new URLSearchParams({
    keyword,
    category: toApiCategory(category),
    page: String(page),
    size: String(size),
  });
  const response = await apiRequest(`/api/contents/search?${params}`);

  return {
    items: response.data.map((content) => ({
      ...content,
      id: content.contentId,
    })),
    meta: response.meta,
  };
}

export default searchContents;
