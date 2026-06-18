export const whatsappConfig = {
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? 'gamora-dev-verify-token',
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? '',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? '',
  /** Workspace por defecto para mensajes entrantes (hasta routing multi-tenant) */
  defaultWorkspaceSlug: process.env.WHATSAPP_DEFAULT_WORKSPACE_SLUG ?? 'ferreteria-luisito',
  /** Si false, el sender solo registra en logs (sin Graph API) */
  sendEnabled: process.env.WHATSAPP_SEND_ENABLED === 'true',
  graphApiVersion: process.env.WHATSAPP_GRAPH_API_VERSION ?? 'v21.0',
};
