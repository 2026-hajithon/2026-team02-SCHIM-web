import {
  apiRequest,
  setAnonymousToken,
} from "../../../utils/apiClient.js";

async function createUser(nickname) {
  const response = await apiRequest("/api/users", {
    auth: false,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname }),
  });

  setAnonymousToken(response.data.anonymousToken);
  return response.data;
}

export default createUser;
