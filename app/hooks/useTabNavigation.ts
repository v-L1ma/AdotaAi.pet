import { usePathname, useRouter } from "expo-router";

type TabRoute = "/Home" | "/listagem-pets" | "/criar-anuncio" | "/config" | "/meus-pets" | "/perfil-user" | "/eventos" | `/criar-anuncio?petId=${string}`;

/**
 * Hook para gerenciar navegação entre as abas principais
 * 
 * Estratégia:
 * 1. Usa push() normalmente para permitir histórico natural
 * 2. Se o usuário clica na aba atual, não navega (evita animação desnecessária)
 * 3. Quando muda de aba, permite voltar para aba anterior (comportamento natural)
 */
export function useTabNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const normalizedPath = (pathname || "").toLowerCase();

  /**
   * Navega para uma aba principal
   */
  const navigateToTab = (route: TabRoute) => {
    // Verifica se já está na mesma aba
    const isOnSameTab =
      (route === "/Home" && (normalizedPath === "/" || normalizedPath === "/Home")) ||
      (route === "/listagem-pets" && (normalizedPath === "/listagem-pets" || normalizedPath === "/listagempets")) ||
      (route === "/criar-anuncio" && (normalizedPath === "/criar-anuncio" || normalizedPath === "/criaranuncio")) ||
      (route === "/config" && normalizedPath === "/config") ||
      (route === "/meus-pets" && (normalizedPath === "/meus-pets" || normalizedPath === "/meuspets")) ||
      (route === "/perfil-user" && normalizedPath === "/perfil-user") ||
      (route === "/eventos" && normalizedPath === "/eventos")

    if (isOnSameTab) {
      // Já está na aba atual: não navega para evitar animação/flash da mesma tela.
      return;
    }

    // Aba diferente: navegação normal, preservando histórico.
    router.push(route);
  };

  return { navigateToTab };
}
