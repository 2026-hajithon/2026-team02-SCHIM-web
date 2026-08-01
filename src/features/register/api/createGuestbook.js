import { apiRequest } from "../../../utils/apiClient.js";
import { toApiCategory } from "./category.js";

async function createGuestbook({ imageBlob, content }) {
  if (!imageBlob) {
    throw new Error("등록할 카드 이미지가 없어요.");
  }

  if (imageBlob.type !== "image/png") {
    throw new Error("PNG 형식의 카드 이미지만 등록할 수 있어요.");
  }

  if (imageBlob.size > 10 * 1024 * 1024) {
    throw new Error("카드 이미지 크기는 10MB 이하여야 해요.");
  }

  const formData = new FormData();
  const requestContent = {
    contentId:
      typeof content.contentId === "number" ? content.contentId : null,
    provider: content.provider ?? "MANUAL",
    externalId: content.externalId ?? null,
    category: toApiCategory(content.category),
    title: content.title,
    description: content.description ?? "",
    details: content.details ?? {},
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
