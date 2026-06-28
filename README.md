# Consulta FIPE — Landing Page

Site para consultar o valor de veículos (carros, motos e caminhões) pela **Tabela FIPE**, a referência de preços mais usada no Brasil.

Este projeto é uma **landing page** (página de apresentação) com um formulário de consulta que busca os dados na internet, sem precisar de servidor próprio.

---

## O que este projeto faz?

1. Apresenta o serviço de consulta FIPE com seções explicativas (como funciona, benefícios, FAQ).
2. Permite escolher **tipo**, **marca**, **modelo**, **código FIPE** e **ano/combustível**.
3. Mostra o **valor FIPE** atualizado do veículo selecionado.

Os dados vêm da [Brasil API](https://brasilapi.com.br/docs#tag/FIPE), uma API pública e gratuita.

---

## Tecnologias usadas

| Tecnologia | Para que serve neste projeto |
|------------|------------------------------|
| **HTML** (`index.html`) | Estrutura da página: textos, botões, formulário |
| **CSS** (`index.css`) | Visual: cores, layout, responsividade (celular e desktop) |
| **JavaScript** (`index.js`) | Comportamento: buscar dados na API, validar formulário, menu mobile |
| **SVG** (`assets/`) | Imagens e ícones leves |

Não há frameworks (React, Vue, etc.) nem banco de dados — é um projeto **front-end puro**, ideal para quem está começando.

---

## Estrutura de pastas

```
Project Landin Page and API/
├── index.html      # Página principal
├── index.css       # Estilos
├── index.js        # Lógica e chamadas à API
├── assets/         # Imagens e ícones (.svg)
└── README.md       # Este arquivo
```

---

## Como rodar o projeto

Você **não precisa instalar** Node.js, npm ou banco de dados.

### Opção 1 — Abrir direto no navegador

1. Abra a pasta do projeto no explorador de arquivos.
2. Dê duplo clique em `index.html`.
3. A página abrirá no seu navegador padrão.

> **Dica:** Se algo não funcionar bem (por exemplo, requisições à API), use a Opção 2.

### Opção 2 — Live Server (recomendado)

Se você usa **VS Code** ou **Cursor**:

1. Instale a extensão **Live Server**.
2. Clique com o botão direito em `index.html`.
3. Escolha **Open with Live Server**.

Isso abre a página em `http://localhost:5500` (ou porta similar) e recarrega automaticamente quando você salva alterações.

---

## Como usar a consulta FIPE

1. Role até a seção **Consultar** (ou clique em "Consultar agora").
2. Selecione o **tipo** do veículo (carros, motos ou caminhões).
3. Escolha **marca** e **modelo** — as listas são preenchidas automaticamente pela API.
4. Digite o **código FIPE** no formato `000000-0` (exemplo: `001004-9`).
5. Selecione **ano e combustível**.
6. Clique em **Consultar valor FIPE**.

O valor aparecerá abaixo do formulário.

---

## Como funciona por trás (resumo para iniciantes)

### HTML — o esqueleto

Define o que existe na tela: título, parágrafos, `<select>` (listas), `<form>` (formulário), etc.

### CSS — a aparência

Controla fontes, cores, espaçamentos e como a página se adapta em telas menores (celular).

### JavaScript — a ação

O arquivo `index.js` faz coisas como:

- **`fetch`** — envia pedidos à Brasil API e recebe marcas, modelos e preços.
- **`addEventListener`** — reage a cliques e mudanças nos campos do formulário.
- **Validação** — verifica se o código FIPE está no formato correto antes de consultar.

Exemplo simplificado de chamada à API:

```javascript
const API_BASE = 'https://brasilapi.com.br/api/fipe';
const marcas = await fetch(`${API_BASE}/marcas/v1/carros`);
```

---

## API utilizada

| Recurso | Endpoint (exemplo) |
|---------|-------------------|
| Marcas | `/api/fipe/marcas/v1/{tipo}` |
| Modelos | `/api/fipe/veiculos/v1/{tipo}/{marca}` |
| Preços | `/api/fipe/preco/v1/{codigoFipe}` |

Documentação completa: [Brasil API — FIPE](https://brasilapi.com.br/docs#tag/FIPE)

---

## Possíveis problemas

| Problema | O que tentar |
|----------|--------------|
| Listas não carregam | Verifique sua conexão com a internet |
| Erro ao consultar | Confira se o código FIPE está no formato `000000-0` |
| Página em branco ou estranha | Use Live Server em vez de abrir o arquivo direto |
| API fora do ar | Aguarde e tente de novo; a Brasil API é mantida por terceiros |

---

## Ideias para praticar e evoluir

Se quiser aprender mais editando este projeto:

- Mudar cores e fontes no `index.css`
- Adicionar novos textos ou seções no `index.html`
- Exibir mais detalhes do resultado da API no `index.js`
- Criar um botão para copiar o valor FIPE
- Adicionar modo escuro (dark mode)

---

## Licença e créditos

- Dados FIPE via [Brasil API](https://brasilapi.com.br)
- Projeto educacional — sinta-se à vontade para estudar, modificar e compartilhar

---

## Autor

Projeto criado para aprendizado de desenvolvimento web front-end.
