export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/api/v1/ws",
  devUserId: process.env.NEXT_PUBLIC_DEV_USER_ID || "",
  devCompanyId: process.env.NEXT_PUBLIC_DEV_COMPANY_ID || "",
  devAuthToken: process.env.NEXT_PUBLIC_DEV_AUTH_TOKEN || "",
  defaultConversationId: process.env.NEXT_PUBLIC_DEFAULT_CONVERSATION_ID || "",
};
