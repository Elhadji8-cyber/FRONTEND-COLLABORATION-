import { AuthService } from "@/services/auth.service";

// Store volontairement simple pour l'instant: pas besoin d'ajouter Zustand.
// Les composants clients peuvent lire la session depuis localStorage via ces helpers.
export const authStore = {
  getSession: () => AuthService.getSession(),
  getAccessToken: () => AuthService.getAccessToken(),
  getCompanyId: () => AuthService.getCompanyId(),
  setCompanyId: (companyId: string) => AuthService.setCompanyId(companyId),
  logout: () => AuthService.logout(),
};
