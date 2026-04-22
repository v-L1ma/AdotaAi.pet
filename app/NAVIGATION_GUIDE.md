# Guia de Navegação - AdotaAI

## 📋 Resumo das Melhorias

O app implementa um sistema de navegação inteligente que evita dois extremos:
- ❌ Não empilha telas infinitamente ao clicar múltiplas vezes
- ❌ Não quebra o histórico natural quando você volta

## 🎯 Conceito Principal: Nested Tab Navigation

Esse padrão é usado em apps reais como **Instagram**, **WhatsApp**, **TikTok**, **Uber**, **AirBnb**:

```
Home Stack:        Buscar Pets Stack:     Criar Anúncio Stack:
[Home]             [Buscar Pets]          [Criar Anúncio]

Quando clica em Buscar Pets enquanto em Home:
Home → Buscar Pets (push - permite voltar)

Quando clica em Buscar Pets novamente:
Buscar Pets (replace - evita duplicata)

Quando volta:
Buscar Pets ← Home (volta para Home anterior)
```

### **Regra Simples:**
1. Se está **na mesma aba** → usa `replace()` (evita duplicata)
2. Se está **em aba diferente** → usa `push()` (permite voltar)

### 2. **Navegação em Fluxos** (Push Only)
Rotas de formulário, detalhes, etc: `/criar-formulario`, `/gerenciar-formularios`, `/detalhes-evento`

**Comportamento esperado:**
- Usa `push` normalmente
- Cria stack de navegação
- Usuário pode voltar com o botão de voltar

**Como usar:**
```tsx
import { useRouter } from "expo-router";

export default function MyComponent() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push("/criar-formulario")}>
      <Text>Criar Formulário</Text>
    </TouchableOpacity>
  );
}
```

## 🔄 Componentes Já Atualizados

- ✅ `NavBar.tsx` - Usa `navigateToTab` para todas as abas
- ✅ `Home.tsx` - Usa `navigateToTab` para "Buscar Pets"
- ✅ `cadastro.tsx` - Usa `navigateToTab` para ir para Home
- ✅ `login.tsx` - Usa `navigateToTab` para ir para Home
- ✅ `MeusPets.tsx` - Usa `navigateToTab` para ir para Criar Anúncio

## 📝 Regra de Ouro

| Situação | Função | Exemplo |
|----------|--------|---------|
| Navegar para aba principal | `navigateToTab()` | Botão de aba na navbar |
| Navegar em fluxo (formulário, detalhes) | `router.push()` | Botão "Próximo" em formulário |
| Voltar para tela anterior | `router.back()` | Botão de voltar |
| Substituir tela atual sem empilhar | `router.replace()` | Fluxo de autenticação |

## 🐛 Identificar Problema de Stack

Se você notar que:
- Clicar no mesmo botão múltiplas vezes abre a tela várias vezes
- O botão de voltar aparece quando não deveria
- A performance degrada ao navegar

Provavelmente está usando `push()` quando deveria usar `navigateToTab()`.

## ✅ Checklist para Novas Features

Ao adicionar novos botões ou links de navegação:

- [ ] É uma aba principal? Use `navigateToTab()`
- [ ] É um fluxo/formulário? Use `router.push()`
- [ ] Importou o hook correto?
- [ ] Testou clicando múltiplas vezes?
- [ ] Testou o comportamento de voltar?

## 📚 Estrutura do Hook

O hook `useTabNavigation` implementa a inteligência:

```typescript
// Em: hooks/useTabNavigation.ts
export function useTabNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  
  const navigateToTab = (route: TabRoute) => {
    const isOnSameTab = /* verifica se já está nessa aba */;
    
    if (isOnSameTab) {
      router.replace(route);   // 2x no mesmo botão -> replace
    } else {
      router.push(route);      // Mudar de aba -> push (permite voltar)
    }
  };

  return { navigateToTab };
}
```

### Resultado:
```
Cenário 1: Clicando múltiplas vezes no mesmo botão
Home (push) → Buscar Pets (replace) → Buscar Pets ✅ Sem duplicata

Cenário 2: Alternando entre abas
Home (push) → Buscar Pets (push) → Home (push) ✅ Histórico completo
Voltar: Home (volta naturalmente)

Cenário 3: Clicando 2x no mesmo botão
Buscar Pets (replace) → Buscar Pets (replace) ✅ Sem empilhar
```

---

**Última atualização:** 26 de março de 2026

---

## 🏆 Por Que Essa Solução é Melhor?

### Problema 1: Empilhamento Infinito
```
❌ Antes (sem `navigateToTab`)
Home → Buscar Pets → Home → Buscar Pets → Home
(cliques múltiplos criam stack gigante)

✅ Agora (com `navigateToTab`)
Home → Buscar Pets → [Buscar Pets replace] → [Buscar Pets replace]
(cliques múltiplos na mesma aba não criam novas instâncias)
```

### Problema 2: Histórico Quebrado
```
❌ Antes (com replace em tudo)
Home → Buscar Pets (replace) → Home (replace)
Ao clicar voltar: Vai para primeira tela do app ❌

✅ Agora (com push entre abas diferentes)
Home → Buscar Pets (push) → Home (push)
Ao clicar voltar: Volta para Buscar Pets ✅
```

## 📱 Exemplos de Apps que Usam Esse Padrão

- **Instagram**: Volta entre abas mantém histórico
- **WhatsApp**: Cada aba tem seu próprio stack
- **TikTok**: Cliques múltiplos não duplicam feed
- **Gmail**: Inboxes não empilham ao clicar 2x
- **Uber**: Cliques múltiplos em "Home" não duplicam

---

**Última atualização:** 26 de março de 2026
