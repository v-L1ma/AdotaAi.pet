# Adotaí

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Projeto para facilitação de adoção de animais. Plataforma full-stack/mobile que possibilita institutos de proteção animal, pessoas físicas e adotantes interagirem para cadastro, visualização e adoção de pets.

---

## Índice

- [Visão Geral](#visão-geral)  
- [Funcionalidades](#funcionalidades)  
- [Arquitetura / Tecnologias](#arquitetura--tecnologias)  
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Licença](#licença)

---

## Visão Geral

O **Adotaí** tem como objetivo conectar animais que precisam de lar com adotantes, simplificando o processo de:

- cadastro de animais para adoção;
- busca por animais disponíveis (por espécie, localização, porte etc.);
- contato entre adotante e quem disponibiliza o animal;
- gerenciar perfil do adotante / instituição.

É ideal para protetores de animais, ONGs, abrigos ou voluntários que desejam publicar animais para adoção, bem como para pessoas que querem adotar.

---

## Funcionalidades

| Funcionalidade                       | Descrição                                                                 |
|---------------------------------------|---------------------------------------------------------------------------|
| Cadastro de usuários / autenticação   | Instituições e adotantes podem se registrar, fazer login, editar perfil. |
| Cadastro de animais                  | Inserir foto, descrição, espécie, porte, estado de saúde, localização.    |
| Listagem e busca/filter de pets       | Filtros por espécie, porte, localização, status de adoção etc.           |
| Perfil do animal                    | Ver detalhes, fotos, histórico, informações de contato.                 |
| Notificações / mensagens              | Permitir comunicação segura entre adotante e instituição.                |
| Painel da instituição / voluntário     | Gerenciar os anúncios de animais, aprovar adoções, etc.                  |
| Versão mobile / app híbrido ou conectável | Acesso via dispositivos móveis (React Native já presente).              |

---

## Arquitetura / Tecnologias

- **Front / Mobile**: React Native, TypeScript  
- **Backend**: Java / Spring Boot (ou framework similar)  
- **Banco de Dados**: Relacional (PostgreSQL/MySQL)  
- **Gerenciamento de pacotes**: npm / yarn (para mobile) e Maven/Gradle (para backend)

---

## Estrutura do Projeto

```
AdotaAi.pet/
├── app/                   # código do front-end / mobile
│    ├── src/
│    └── ...
├── backend/               # servidor, API
│    ├── src/
│    └── ...
├── package.json
├── .gitignore
├── LICENSE
└── README.md
```

---

## Licença

Este projeto está licenciado sob a **MIT License**.

---
