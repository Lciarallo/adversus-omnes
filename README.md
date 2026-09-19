# 🏛️ CONTRA HOMINES — Bibliotheca et Archivum

> **"Livros, documentos e ideias em perspectiva."**

Plataforma cultural integrando preservação de acervo histórico, acervo digital com leitor protegido contra extração, e-commerce de acervo físico raro/usado, clube de assinaturas recorrentes, espaço editorial para artigos autorais e painel administrativo com integração ao gateway InfinitePay e Correios.

---

## 🌐 Links Oficiais do Projeto

* **Link de Produção & Testes (Cloudflare Workers):** [https://contra-homines.luizeduardociarallo.workers.dev](https://contra-homines.luizeduardociarallo.workers.dev)
* **Repositório GitHub Oficial:** [https://github.com/Lciarallo/contra-homines](https://github.com/Lciarallo/contra-homines)

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
* **Leitor Seguro:** Renderização gráfica via Canvas HTML5, restrição de atalhos e sobreposição dinâmica de marca d'água per-session.
* **Infraestrutura & Deploy:** Cloudflare Workers / Pages (distribuição global na borda).
* **Gateways & Logística:** Módulos de integração para InfinitePay (Pix Instantâneo e Cartão de Crédito) e Correios (SEDEX, PAC e Mini Envios por CEP).

---

## 🎯 Módulos e Requisitos Implementados

### 1. 📚 Conteúdos, Autores e Artigos
* **Autores e suas Obras (CRUD Completo):** Cadastro, edição, listagem e remoção de pensadores e suas bibliografias (fotos históricas, períodos, biografias e movimentos políticos associados).
* **Blog Editorial / Artigos Autorais (CMS):** Sistema completo para administradores redigirem e publicarem ensaios críticos, notas de pesquisa e resenhas bibliográficas.
* **Acervo de Documentos Históricos:** Preservação de manifestos republicanos, atas secretas e fac-símiles de época.
* **Taxonomia e Filtros Cruzados:** Filtros multifacetados por Autor, Movimento Político (Liberalismo Clássico, Marxismo, Anarquismo, etc.), Período Histórico e Condição da obra.

### 2. 💻 Acervo Online e Leitor Seguro
* **PDFs Abertos:** Visualização e download direto de documentos em domínio público.
* **Clube de Assinaturas:** Planos *Leitor Curioso*, *Pesquisador* e *Membro do Círculo*.
* **Leitor Protegido (DRM-Lite):**
  * Renderização em `<canvas>` vetorial sem expor URLs diretas para download indevido.
  * Bloqueio de clique direito (`contextmenu`) e atalhos de cópia/impressão (`Ctrl+S`, `Ctrl+P`, `Ctrl+C`, `Ctrl+U`).
  * Marca d'água dinâmica do assinante com nome, e-mail e hash de sessão na tela.

### 3. 🏷️ Acervo Físico (E-Commerce Cultural)
* **Catálogo de Peças Raras & Usadas:** Livros com estoque unitário (peça única), detalhes de conservação e fotos reais.
* **Carrinho e Descontos Automáticos:** Desconto de 15% a 20% para assinantes do clube.
* **Cálculo de Frete Correios:** Simulação de SEDEX, PAC e Mini Envios por CEP. Frete grátis para membros do plano Círculo.
* **Sistema de Cupons:** Validação de cupons promocionais (ex: `BEMVINDO10`, `HISTORIA15`).

### 4. 💰 Dashboard e Pagamentos
* **Gateway InfinitePay:** Formulário de credenciais (Merchant ID, API Key, Wallet ID, Webhooks) e modal de checkout com Pix (QR Code + Copia e Cola) e Cartão de Crédito.
* **Métricas de Negócio:** Faturamento bruto, Receita Recorrente Mensal (MRR), total de pedidos e alerta de estoque crítico.
* **Gestão de Estoque & Catálogo:** Edição rápida de unidades disponíveis e preços.
* **Gestão de Planos & Cupons:** Criação e alteração de cupons e valores de planos.

### 5. 👤 Área do Cliente (Portal do Assinante)
* Informações do plano de assinatura e status de renovação.
* Histórico de pedidos com código de rastreamento dos Correios.
* Biblioteca digital desbloqueada com acesso direto ao leitor seguro.
* Seletor de perfil no cabeçalho para testar instantaneamente os papéis de Visitante, Assinante e Administrador.

---

## 🚀 Como Executar Localmente

```bash
# Clonar o repositório
git clone https://github.com/Lciarallo/contra-homines.git

# Acessar a pasta
cd contra-homines

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Fazer deploy no Cloudflare
npm run deploy
```
