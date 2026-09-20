# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Público principal — pesquisadores e estudantes** de história, ciência política e filosofia. Chegam procurando fontes primárias, obras e contexto para trabalho acadêmico ou pesquisa própria; avaliam a plataforma pela confiabilidade da ficha (autor, período, movimento, proveniência) antes de confiar no material.

Outros públicos confirmados, todos reais e atendidos pela mesma plataforma:

- **Colecionadores e bibliófilos** — caçam edições raras, esgotadas e peças únicas. Decidem por estado de conservação, procedência e preço; compram exemplar único, não catálogo reimpresso.
- **Leitores de formação política** — público geral interessado em ideias políticas, sem formação acadêmica prévia. Entram pelos artigos e precisam de um caminho do ensaio até o autor, o movimento e a obra.
- **Militantes e formadores** — usam o acervo como material de estudo para círculos de leitura, cursos e grupos de formação. Interesse em reunir conjuntos temáticos, não itens isolados.

**Operador:** um administrador único (o editor/proprietário do acervo) escreve os artigos, cataloga autores e obras, gerencia estoque, planos e cupons. Não há equipe editorial nem múltiplos papéis administrativos.

O código modela três papéis: `visitor`, `subscriber` e `admin`.

## Product Purpose

Adversus Omnes — Bibliotheca et Archivum é uma plataforma cultural que reúne, no mesmo lugar, quatro coisas que normalmente vivem separadas: o acervo digital de livros e documentos históricos, a venda de acervo físico raro e usado, o clube de assinaturas com material exclusivo, e o ensaio crítico autoral. O fio que as une é uma taxonomia cruzada — autor, movimento político, período histórico, tema e evento — que permite atravessar o acervo como uma rede de ideias em vez de uma prateleira.

Existe para que livros, documentos e ideias sejam lidos **em perspectiva**: cada peça acompanhada do seu contexto histórico e da sua linhagem intelectual.

Sucesso, no estágio atual: a plataforma convence quem a vê de que esse acervo merece existir e ser sustentado. Sucesso, adiante: pesquisador encontra o documento que não acharia em outro lugar, colecionador compra a peça certa com confiança na descrição, assinante volta regularmente ao acervo digital.

## Positioning

Quatro diferenciais confirmados, todos obrigatórios — nenhum redesign pode descartá-los:

1. **Documentos primários raros** — manifestos, atas, fac-símiles e materiais históricos difíceis de encontrar em qualquer outro lugar, digitalizados e preservados. É o que nenhum sebo online oferece.
2. **Curadoria cruzada** — obra, autor, movimento político, período e evento ligados entre si; a navegação é a tese.
3. **Acervo físico com procedência** — peças únicas, primeiras edições e obras esgotadas descritas com honestidade de estado e história do exemplar.
4. **Ensaio crítico autoral** — o acervo vem acompanhado de leitura crítica assinada, não apenas catalogado.

Um sebo online tem (3). Um blog de história tem (4). Um repositório acadêmico tem (1). A combinação dos quatro sob a mesma taxonomia é o que não se copia.

## Operating Context

- **Administrador:** escreve e publica ensaios pelo CMS interno; cadastra autores com biografia, período, movimento e obras; cataloga itens físicos com condição, estoque unitário e preço; digitaliza documentos e define se são livres ou exclusivos; administra planos, cupons e credenciais do gateway; acompanha faturamento, MRR e alerta de estoque crítico pelo dashboard.
- **Assinante:** acessa a biblioteca digital desbloqueada pelo plano, lê material exclusivo no leitor protegido, consulta status e renovação do plano no portal do cliente, e recebe desconto automático (15–20%) nas compras físicas.
- **Comprador:** monta carrinho de peças únicas, aplica cupom, simula frete por CEP (SEDEX, PAC, Mini Envios), paga por Pix ou cartão, e acompanha o pedido por código de rastreamento.
- **Visitante:** lê artigos, navega autores e baixa PDFs de domínio público sem cadastro.
- Um seletor de perfil no cabeçalho troca entre Visitante, Assinante e Administrador instantaneamente — é dispositivo de demonstração do protótipo, não autenticação.
- Planos do clube: *Leitor Curioso*, *Pesquisador* e *Membro do Círculo* (este último com frete grátis).
- Público e interface em português do Brasil; a marca usa latinismos (Bibliotheca et Archivum).

## Capabilities and Constraints

**Já implementado e funcionando no protótipo:**

- CRUD completo de autores e suas obras; CMS de artigos com rascunho/publicado.
- Catálogo em três naturezas: `physical`, `digital`, `historical_doc`; acesso `free`, `exclusive` ou `sale`.
- Filtros cruzados por autor, movimento político, período, tema, evento e condição da obra.
- Leitor protegido (DRM-lite): renderização em `<canvas>` sem expor a URL do arquivo, bloqueio de menu de contexto e de `Ctrl+S/P/C/U`, marca d'água dinâmica com nome, e-mail e hash de sessão do assinante.
- Carrinho com estoque unitário, cupons, descontos de assinante, simulação de frete Correios por CEP.
- Modal de checkout InfinitePay com Pix (QR Code e copia-e-cola) e cartão de crédito.
- Dashboard administrativo: faturamento bruto, MRR, pedidos, estoque crítico, edição de preços e unidades, gestão de planos e cupons, formulário de credenciais do gateway.
- Portal do cliente: plano ativo, histórico de pedidos com rastreio, biblioteca digital desbloqueada.

**Restrições e verdades técnicas que o trabalho futuro não pode contradizer:**

- **Destino atual é protótipo de apresentação.** Serve para demonstrar o conceito a sócios, parceiros e investidores. Dados simulados continuam aceitáveis; a prioridade é a experiência convencer.
- Não existe backend. Todo o estado vive em `localStorage` sob as chaves `contraste_*` no `StoreContext`; `src/data/initialData.ts` é a semente.
- Não há autenticação real: o papel do usuário é escolhido no cabeçalho.
- InfinitePay e Correios são **simulados** — nenhuma chamada real de API, nenhum pagamento processado, nenhuma cotação real de frete.
- **A conta InfinitePay ainda não foi definida.** Está explicitamente em aberto; não inventar credenciais, taxas ou contrato.
- O leitor protegido é **dissuasão, não criptografia**: reduz extração casual e marca o material com identidade do assinante, mas não impede captura de tela. Nunca prometer proteção absoluta na interface ou na comunicação.
- Stack: React 19, TypeScript, Vite, Tailwind CSS v4, lucide-react, canvas-confetti. SPA sem router — a navegação é um `activeTab` no contexto, com views carregadas por `React.lazy`.
- Deploy em Cloudflare Workers/Pages com `not_found_handling: single-page-application`. Publicado em `https://adversus-omnes.luizeduardociarallo.workers.dev`.

**Explicitamente indecidido (registrar, não inventar):** conta e credenciais do gateway InfinitePay; se e quando entra backend real, banco e autenticação; contrato com os Correios; domínio próprio; preços definitivos dos planos.

## Brand Commitments

- Nome: **Adversus Omnes — Bibliotheca et Archivum**. Já aplicado em toda a interface, no título do documento e no repositório.
- Tagline: *"Livros, documentos e ideias em perspectiva."*
- Logotipo oficial fornecido pelo usuário em `public/logo.jpg` — também usado como favicon.
- Idioma: português do Brasil, com latinismos de marca deliberados.
- **Voz:** documental no acervo, autoral nos ensaios. Fichas de catálogo e descrições de autor descrevem obra e contexto com rigor e sem julgamento; os artigos assinados carregam a leitura crítica do editor. Essa separação entre as duas camadas é explícita e deve permanecer legível na interface.
- A plataforma cataloga movimentos políticos opostos (liberalismo clássico, marxismo, anarquismo, republicanismo) e trata todos com o mesmo rigor descritivo.

## Evidence on Hand

- **Conteúdo semente é demonstração, não acervo real.** `src/data/initialData.ts` traz autores históricos verdadeiros (Tocqueville, Rosa Luxemburgo, Machado de Assis, Kropotkin, Hannah Arendt, Euclides da Cunha) com biografias e fichas escritas para o protótipo.
- **Documentos "históricos" do acervo digital são ficção de demonstração** — "Atas Secretas da Constituinte de 1891", "Diários Clandestinos de Berlim", "Correspondência inédita Arendt–Jaspers" e seus textos de página não são fac-símiles reais. Não tratar como fonte, não citar como prova, não reforçar a alegação de ineditismo fora do protótipo.
- **Não existe um único PDF real no projeto.** O leitor renderiza texto simulado em canvas.
- **Todas as imagens são stock genérico do Unsplash** (21 URLs), inclusive os retratos de autores — a foto que representa Rosa Luxemburgo é uma modelo contemporânea. Qualquer trabalho que dependa de imagem precisa substituí-las por retratos históricos de domínio público e fotografias reais dos exemplares.
- Pedidos, códigos de rastreamento, métricas de faturamento e MRR do dashboard são gerados; nenhum reflete venda real.
- Não há depoimentos, clientes, parceiros institucionais, números de acervo ou imprensa. Nenhum deles pode ser fabricado em nenhuma superfície.

## Product Principles

1. **O contexto acompanha a peça.** Nenhum item aparece solto: autor, movimento, período e evento vêm junto, e cada um é uma porta para o resto do acervo.
2. **Honestidade de proveniência.** Estado de conservação, edição, natureza do exemplar e origem do material se descrevem como são — o valor do acervo depende de acreditarem na ficha.
3. **Descrição e opinião não se misturam.** O catálogo documenta; o ensaio argumenta. O leitor sempre sabe em qual camada está.
4. **Quatro públicos, um acervo.** Pesquisador, colecionador, leitor iniciante e formador entram por portas diferentes e chegam ao mesmo material; nenhuma jornada pode ser construída excluindo as outras.
5. **Prometer só o que o sistema cumpre.** Proteção do material, prazos, pagamentos e disponibilidade se comunicam pelo que realmente existe — hoje, um protótipo.

## Accessibility & Inclusion

- Interface inteiramente em português do Brasil; nenhum requisito de internacionalização estabelecido.
- Público inclui leitores sem formação acadêmica: terminologia histórica e latina precisa ser legível para quem chega pelo artigo, não só para quem chega pela bibliografia.
- O trabalho anterior já passou por uma correção de acessibilidade (alvos de toque e contraste); manter esse patamar.
