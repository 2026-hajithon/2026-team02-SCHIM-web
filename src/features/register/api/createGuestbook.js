import { apiRequest } from "../../../utils/apiClient.js";
import { toApiCategory } from "./category.js";

async function createGuestbook({ imageBlob, content }) {
  if (!imageBlob) {
    throw new Error("등록할 카드 이미지가 없어요.");
  }

  const formData = new FormData();
  const requestContent = {
    ...content,
    category: toApiCategory(content.category),
  };

  formData.append("image", imageBlob, "guestbook.png");

  formData.append(
    "content",
    new Blob([JSON.stringify(requestContent)], { type: "application/json" }),
  );

  const response = await apiRequest("/api/guestbooks", {
    method: "POST",
    body: formData,
  });

  return response.data;
}

export default createGuestbook;
