import { apiRequest } from "../../../utils/apiClient.js";

function toFrontendCategory(category) {
  return category === "PERFORMANCE" ? "SHOW" : category;
}

async function openGuestbook(guestbookId) {
  const response = await apiRequest(`/api/guestbooks/${guestbookId}/open`, {
    method: "POST",
  });
  const { content, ...guestbook } = response.data;

  return {
    ...guestbook,
    contentId: content.contentId,
    category: toFrontendCategory(content.category),
    title: content.title,
    subtitle: content.description,
    guestbookCount: content.guestbookCount,
  };
}

export default openGuestbook;
