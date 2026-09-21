import { Author, Article, CatalogItem, SubscriptionPlan, Coupon, InfinitePayConfig, Order } from '../types';

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 'author-1',
    name: 'Alexis de Tocqueville',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    bio: 'Pensador político, historiador e sociólogo francês. Célebre pela sua análise pioneira sobre as instituições democráticas, a tirania da maioria e o surgimento do individualismo moderno nas Américas.',
    birthYear: 1805,
    deathYear: 1859,
    period: 'Século XIX',
    politicalMovement: 'Liberalismo Clássico',
    themes: ['Democracia', 'Instituições Políticas', 'Liberdade Civil', 'Sociologia'],
    works: ['A Democracia na América', 'O Antigo Regime e a Revolução', 'Lembranças de 1848'],
    featured: true
  },
  {
    id: 'author-2',
    name: 'Rosa Luxemburgo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Filósofa marxista, economista e revolucionária polonesa-alemã. Teve papel central na social-democracia alemã e fundou a Liga Espartaquista. Destacou-se pela defesa radical da liberdade de pensamento e crítica ao autoritarismo.',
    birthYear: 1871,
    deathYear: 1919,
    period: 'Século XX',
    politicalMovement: 'Socialismo Democrático',
    themes: ['Economia Política', 'Espartaquismo', 'Imperialismo', 'Liberdade Crítica'],
    works: ['Reforma ou Revolução?', 'A Acumulação do Capital', 'A Revolução Russa'],
    featured: true
  },
  {
    id: 'author-3',
    name: 'Machado de Assis',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Maior expoente da literatura brasileira, jornalista, cronista e fundador da Academia Brasileira de Letras. Desnudou as contradições da elite escravocrata do Segundo Reinado com ironia refinada e pessimismo cósmico.',
    birthYear: 1839,
    deathYear: 1908,
    period: 'Século XIX',
    politicalMovement: 'Abolicionismo / Crítica Social',
    themes: ['Realismo Psicológico', 'Crítica Social', 'Sociedade Escravista', 'Ironia Filosófica'],
    works: ['Memórias Póstumas de Brás Cubas', 'Dom Casmurro', 'Quincas Borba', 'O Alienista'],
    featured: true
  },
  {
    id: 'author-4',
    name: 'Piotr Kropotkin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'Geógrafo, zoólogo e principal teórico do anarco-comunismo. Desenvolveu a tese científica do apoio mútuo como fator preponderante da evolução biológica e das sociedades humanas.',
    birthYear: 1842,
    deathYear: 1921,
    period: 'Século XIX / XX',
    politicalMovement: 'Anarquismo Comunista',
    themes: ['Apoio Mútuo', 'Geografia Social', 'Ética Libertária', 'Evolucionismo'],
    works: ['A Conquista do Pão', 'Apoio Mútuo: Um Fator de Evolução', 'Campos, Fábricas e Oficinas'],
    featured: false
  },
  {
    id: 'author-5',
    name: 'Hannah Arendt',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Uma das pensadoras políticas mais influentes do século XX. Analisou a essência do totalitarismo moderno, a banalidade do mal, a condição humana e a importância da esfera pública para a liberdade.',
    birthYear: 1906,
    deathYear: 1975,
    period: 'Século XX',
    politicalMovement: 'Filosofia Política Republicana',
    themes: ['Totalitarismo', 'Banalidade do Mal', 'Esfera Pública', 'Ação Política'],
    works: ['As Origens do Totalitarismo', 'A Condição Humana', 'Eichmann em Jerusalém'],
    featured: true
  },
  {
    id: 'author-6',
    name: 'Euclides da Cunha',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'Escritor, jornalista, engenheiro militar e sociólogo. Sua cobertura da Guerra de Canudos resultou na obra-prima Os Sertões, inaugurando uma reflexão científica e dilacerante sobre a identidade brasileira.',
    birthYear: 1866,
    deathYear: 1909,
    period: 'Século XIX / XX',
    politicalMovement: 'Positivismo Republicano',
    themes: ['Guerra de Canudos', 'Sertão Brasileiro', 'Mestiçagem', 'Geografia Social'],
    works: ['Os Sertões', 'Contrastes e Confrontos', 'À Margem da História'],
    featured: false
  },
  {
    id: 'author-plinio-salgado',
    name: 'Plínio Salgado',
    avatar: '/covers/o_cavaleiro_de_itarare.webp',
    bio: 'Escritor, romancista, ensaísta, líder do movimento Verde-Amarelo na Semana de Arte Moderna de 1922 e fundador da Ação Integralista Brasileira e do PRP. Autor prolífico de vasta obra literária, sociológica e parlamentar voltada à interiorização da cultura e à afirmação da identidade nacional.',
    birthYear: 1895,
    deathYear: 1975,
    period: 'Século XX',
    politicalMovement: 'Modernismo Verde-Amarelo / Integralismo',
    themes: ['Espiritualismo', 'Nacionalismo Cívico', 'Romance Histórico', 'Marcha para o Oeste', 'Sociologia Política'],
    works: ['O Estrangeiro', 'O Cavaleiro de Itararé', 'A Quarta Humanidade', 'Madrugada do Espírito', 'Nosso Brasil', 'Oriente', '13 Anos em Brasília'],
    featured: true
  },
  {
    id: 'author-gustavo-barroso',
    name: 'Gustavo Barroso',
    avatar: '/covers/a_ronda_dos_seculos.webp',
    bio: 'Advogado, romancista, historiador militar, folclorista e presidente da Academia Brasileira de Letras em dois mandatos. Diretor histórico do Museu Histórico Nacional e uma das maiores referências intelectuais do tradicionalismo e da historiografia épica brasileira.',
    birthYear: 1888,
    deathYear: 1959,
    period: 'Século XX',
    politicalMovement: 'Integralismo / Tradicionalismo Histórico',
    themes: ['História Militar', 'Folclore Sertanejo', 'Tradição Cívica', 'Crítica Civilizacional'],
    works: ['Terra de Sol', 'A Ronda dos Séculos', 'História Secreta do Brasil', 'O Integralismo em Marcha'],
    featured: true
  },
  {
    id: 'author-abel-rafael-pinto',
    name: 'Abel Rafael Pinto',
    avatar: '/covers/as_vestais_paridas.webp',
    bio: 'Deputado federal, memorialista e líder político mineiro. Secretário de Propaganda da Ação Integralista Brasileira em Juiz de Fora desde 1935, comandante de milícias cívicas, dirigente do PRP e Secretário de Agricultura de Minas Gerais.',
    birthYear: 1914,
    deathYear: 1995,
    period: 'Século XX',
    politicalMovement: 'Integralismo / Doutrina do Sigma (PRP)',
    themes: ['Memória Política', 'Atuação Parlamentar', 'Balanço Institucional Republicano'],
    works: ['As Vestais Paridas'],
    featured: false
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'O Conflito de Narrativas na República das Letras: A correspondência esquecida de 1888',
    slug: 'conflito-narrativas-republica-das-letras-1888',
    subtitle: 'Como cartas privadas revelam o pânico e a euforia dos intelectuais brasileiros às vésperas da abolição e da proclamação.',
    authorName: 'Redação Adversus Omnes / Arquivo Histórico',
    publishedAt: '2026-08-15',
    readTime: '8 min',
    category: 'História e Sociedade',
    tags: ['Abolição', 'Segundo Reinado', 'Machado de Assis', 'Correspondências'],
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    content: `Nas prateleiras empoeiradas dos arquivos da Tipografia Nacional, repousam maços de cartas amarradas por barbantes de sisal. Datadas entre fevereiro e novembro de 1888, essas epístolas expõem um momento de fissura total no ideário monárquico brasileiro.

Ao contrário da versão oficial apaziguadora construída posteriormente pelos livros didáticos, a troca epistolar entre juristas, proprietários de terras e cronistas cariocas transparece uma atmosfera de suspense palpável. 

Machado de Assis, em uma anotação marginal encontrada em seu rascunho de crônica para a Gazeta de Notícias, pontuou que "a liberdade concedida por decreto é apenas o prólogo da verdadeira tempestade moral que as cidades ainda não aprenderam a encarar".

Este artigo examina os documentos primários preservados em nosso acervo físico que documentam a recepção popular e parlamentar da Lei Áurea, confrontando a euforia das ruas com a resistência dos círculos aristocráticos do Vale do Paraíba.`,
    status: 'published',
    historicalPeriod: 'Século XIX',
    politicalMovement: 'Abolicionismo / Crítica Social'
  },
  {
    id: 'art-2',
    title: 'Rosa Luxemburgo e a Crítica Precoce ao Monopólio do Pensamento',
    slug: 'rosa-luxemburgo-critica-monopolio-pensamento',
    subtitle: 'Por que a célebre frase "a liberdade é sempre a liberdade daquele que pensa de modo diferente" continua incomodando contemporâneos.',
    authorName: 'Prof. Marcos Valadares',
    publishedAt: '2026-08-28',
    readTime: '12 min',
    category: 'Filosofia Política',
    tags: ['Rosa Luxemburgo', 'Marxismo', 'Democracia', 'Totalitarismo'],
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    content: `No inverno rigoroso de 1918, presa na fortaleza de Breslau, Rosa Luxemburgo redigia em cadernos de folhas amareladas suas observações sobre os acontecimentos na Rússia. Sem acesso irrestrito às notícias, sua lucidez analítica antecipou em décadas os desvios burocráticos do século XX.

Para Luxemburgo, o socialismo sem liberdade de imprensa, sem confronto aberto de opiniões e sem vida pública livre de terror estatal degeneraria inevitavelmente em uma casca vazia onde apenas a burocracia reina.

Nesta resenha crítica apoiada na rara edição em fac-símile de seus manuscritos, revisamos o peso teórico de suas divergências com Lenin e Trotsky e como a tradição do socialismo democrático encontra nela sua fundação mais robusta.`,
    status: 'published',
    historicalPeriod: 'Século XX',
    politicalMovement: 'Socialismo Democrático'
  },
  {
    id: 'art-3',
    title: 'Guia do Colecionador: Como Identificar Primeiras Edições e Manuscritos Raros',
    slug: 'guia-colecionador-primeiras-edicoes-manuscritos',
    subtitle: 'Mapeamento tipográfico, marcas d’água do papel de trapo e elementos de encadernação oitocentista.',
    authorName: 'Equipe de Curadoria Adversus Omnes',
    publishedAt: '2026-09-02',
    readTime: '10 min',
    category: 'Bibliófilia e Preservação',
    tags: ['Colecionismo', 'Livros Raros', 'Conservação', 'Tipografia'],
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
    content: `A bibliófilia não é mero fetiche pelo objeto antigo, mas uma ciência arqueológica do livro. Identificar se um exemplar de Os Sertões é de fato a primeira tiragem de 1902 exige a inspeção minuciosa de pequenos erros tipográficos que foram corrigidos ainda na gráfica de Laemmert & Cia.

Neste guia prático preparado pelos restauradores de Adversus Omnes, apresentamos as ferramentas básicas do avaliador:
1. Análise da gramatura e textura do papel (papel bíblia, papel trapo, vergê).
2. Verificação de frontispícios, vinhetas e gravuras originais.
3. Avaliação de carimbos de proveniência e ex-líbris históricos.
4. Identificação de encadernações artísticas de época vs. reencadernações modernas.`,
    status: 'published',
    historicalPeriod: 'Século XIX / XX',
    politicalMovement: 'Conservadorismo Cultural'
  }
];

export const INITIAL_CATALOG: CatalogItem[] = [
  // Acervo Físico (E-commerce / Peças Raras / Usados)
  {
    id: 'cat-1',
    title: 'A Democracia na América (2 Volumes em Caixa Especial)',
    author: 'Alexis de Tocqueville',
    authorId: 'author-1',
    year: 1948,
    type: 'physical',
    access: 'sale',
    price: 480.00,
    stock: 1,
    condition: 'Raro / Peça Única',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    description: 'Exemplar comemorativo encadernado em meio-couro legítimo com nervuras e ferros dourados na lombada. Miolo impecável, páginas alvas sem anotações ou oxidação. Guarda em papel marmorizado francês.',
    pages: 820,
    publisher: 'Edições Panorâmicas de Paris',
    dimensions: '16 x 23 cm',
    politicalMovement: 'Liberalismo Clássico',
    period: 'Século XIX',
    event: 'Formação das Democracias Modernas',
    isFeatured: true
  },
  {
    id: 'cat-2',
    title: 'Os Sertões: Campanha de Canudos (3ª Edição Revista)',
    author: 'Euclides da Cunha',
    authorId: 'author-6',
    year: 1905,
    type: 'physical',
    access: 'sale',
    price: 1250.00,
    stock: 1,
    condition: 'Esgotado / 1ª Edição',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    description: 'Terceira edição corrigida e ampliada pelo próprio Euclides da Cunha, publicada pela histórica Livraria Francisco Alves. Contém mapa desdobrável original da região de Canudos e ex-líbris de renomado jurista paulista.',
    pages: 618,
    publisher: 'Livraria Francisco Alves',
    dimensions: '14 x 21 cm',
    politicalMovement: 'Positivismo Republicano',
    period: 'Século XIX / XX',
    event: 'Guerra de Canudos (1896–1897)',
    isFeatured: true
  },
  {
    id: 'cat-3',
    title: 'Reforma ou Revolução? (Edição Histórica em Brochura)',
    author: 'Rosa Luxemburgo',
    authorId: 'author-2',
    year: 1934,
    type: 'physical',
    access: 'sale',
    price: 340.00,
    stock: 2,
    condition: 'Usado - Excelente',
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
    description: 'Tradução pioneira em português publicada clandestinamente no período entreguerras. Papel amarelado natural do tempo, sem carimbos ou rasgos. Exemplar preservado em estojo de papel neutro anti-ácido.',
    pages: 172,
    publisher: 'Edições da Vanguarda Operária',
    dimensions: '12 x 18 cm',
    politicalMovement: 'Socialismo Democrático',
    period: 'Século XX',
    event: 'Revolução Alemã e Movimento Espartaquista',
    isFeatured: false
  },
  {
    id: 'cat-4',
    title: 'A Conquista do Pão (Exemplar com Anotações Marginais de Época)',
    author: 'Piotr Kropotkin',
    authorId: 'author-4',
    year: 1923,
    type: 'physical',
    access: 'sale',
    price: 520.00,
    stock: 1,
    condition: 'Raro / Peça Única',
    coverImage: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&q=80&w=600',
    description: 'Edição lisboeta rara do início da década de 1920. Apresenta preciosas anotações marginais a bico de pena feitas por um operário gráfico anarcossindicalista do Rio de Janeiro.',
    pages: 284,
    publisher: 'Biblioteca Sociológica Aurora',
    dimensions: '13 x 19 cm',
    politicalMovement: 'Anarquismo Comunista',
    period: 'Século XIX / XX',
    event: 'Movimento Operário da Primeira República',
    isFeatured: true
  },
  {
    id: 'cat-5',
    title: 'Memórias Póstumas de Brás Cubas (Edição Comemorativa do Centenário)',
    author: 'Machado de Assis',
    authorId: 'author-3',
    year: 1939,
    type: 'physical',
    access: 'sale',
    price: 390.00,
    stock: 3,
    condition: 'Usado - Excelente',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    description: 'Edição de luxo comemorativa com xilogravuras originais numeradas e prefácio de Mário de Andrade. Encadernação em percalux azul com gravação em relevo prateado.',
    pages: 340,
    publisher: 'Sociedade dos Cem Bibliófilos do Brasil',
    dimensions: '18 x 25 cm',
    politicalMovement: 'Abolicionismo / Crítica Social',
    period: 'Século XIX',
    event: 'Consolidação da Literatura Nacional',
    isFeatured: false
  },

  // Acervo Digital - Aberto / Download Livre
  {
    id: 'cat-6',
    title: 'Manifesto Republicano de 1870 (Edição Fac-similar de Alta Resolução)',
    author: 'Vários Autores (Clube Republicano)',
    year: 1870,
    type: 'historical_doc',
    access: 'free',
    price: 0,
    stock: 9999,
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
    description: 'Documento fundamental que inaugurou a marcha política rumo ao fim da Monarquia no Brasil. Digitalizado em 1200 DPI a partir do original preservado.',
    pages: 28,
    publisher: 'Jornal A República',
    politicalMovement: 'Republicanismo Histórico',
    period: 'Século XIX',
    event: 'Crise do Segundo Reinado',
    downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Frontispício e Declaração de Princípios',
        content: 'É a voz de uma revolução moral que se levanta nas páginas deste manifesto. Nós somos da América e queremos ser americanos. A centralização monárquica sufocou as províncias e concentrou nas mãos do poder moderador as prerrogativas que pertencem à soberania do povo.'
      },
      {
        pageNumber: 2,
        title: 'A Federação como Imperativo',
        content: 'Nenhuma nação continental sobrevive sem a autonomia municipal e provincial. O regime imperial estabeleceu a oligarquia como regra e o apadrinhamento como método. Proclamamos perante o país a necessidade urgente de uma constituição federativa.'
      },
      {
        pageNumber: 3,
        title: 'Conclusão e Assinaturas dos Pioneiros',
        content: 'A história não retrocede diante dos caprichos de dinastias. A República é o destino inevitável da liberdade cívica. Assinam: Quintino Bocaiúva, Saldanha Marinho, Salvador de Mendonça e demais membros da Convenção de Itu.'
      }
    ],
    isFeatured: true
  },
  {
    id: 'cat-7',
    title: 'Declaração dos Direitos do Homem e do Cidadão (Tradução Anotada de 1789)',
    author: 'Assembleia Nacional Constituinte da França',
    year: 1789,
    type: 'historical_doc',
    access: 'free',
    price: 0,
    stock: 9999,
    coverImage: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=600',
    description: 'Texto original de 17 artigos que redefiniu o conceito universal de cidadania e direitos inalienáveis. Inclui ensaio introdutório contextual.',
    pages: 16,
    publisher: 'Imprimerie Nationale',
    politicalMovement: 'Iluminismo / Revolução Francesa',
    period: 'Século XVIII',
    event: 'Queda da Bastilha e Revolução Francesa',
    downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Preâmbulo e Artigos I a V',
        content: 'Os representantes do povo francês, constituídos em Assembleia Nacional, considerando que a ignorância, o esquecimento ou o desprezo dos direitos do homem são as únicas causas dos males públicos e da corrupção dos governos, resolveram expor em uma declaração solene os direitos naturais, inalienáveis e sagrados do homem.'
      },
      {
        pageNumber: 2,
        title: 'Artigo VI ao XVII: Da Lei e da Liberdade',
        content: 'A lei é a expressão da vontade geral. Todos os cidadãos têm o direito de concorrer, pessoalmente ou através de seus representantes, para a sua formação. A livre comunicação de pensamentos e opiniões é um dos direitos mais preciosos do homem: todo cidadão pode, portanto, falar, escrever e imprimir livremente.'
      }
    ],
    isFeatured: false
  },

  // Acervo Digital - EXCLUSIVO PARA ASSINANTES (Leitor Protegido Canvas / DRM-lite)
  {
    id: 'cat-8',
    title: 'Diários Clandestinos de Berlim (1918–1919) — Manuscritos Não Publicados',
    author: 'Rosa Luxemburgo & Karl Liebknecht',
    authorId: 'author-2',
    year: 1919,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. Notas pessoais, telegramas cifrados e cartas escritas nas semanas que antecederam o levante espartaquista de janeiro de 1919 em Berlim. Acesso protegido contra extração e download indevido.',
    pages: 142,
    publisher: 'Fundo Arquivístico Adversus Omnes',
    politicalMovement: 'Socialismo Democrático',
    period: 'Século XX',
    event: 'Revolução Alemã (1918–1919)',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Folha 01: A Tensão nos Quarteis de Moabit',
        content: '14 de Dezembro de 1918. O frio em Berlim corta como navalha, mas as ruas fervem com milhares de soldados desertores que recusam devolver suas armas. Ebert e os generais negociam nos fundos do Reichstag enquanto a massa operária exige a socialização imediata da imprensa.'
      },
      {
        pageNumber: 2,
        title: 'Folha 02: Telegrama Confidencial a Karl Radek',
        content: 'Não podemos permitir que a revolução alemã seja tutelada por uma fórmula pré-fabricada de Moscou. O proletariado ocidental possui tradições culturais e de organização autônoma que não tolerarão a ditadura de comitês centrais fechados. A disciplina revolucionária nasce da convicção espontânea, jamais do terror burocrático.'
      },
      {
        pageNumber: 3,
        title: 'Folha 03: Últimas Anotações no Hotel Eden',
        content: '14 de Janeiro de 1919. O cerco dos Freikorps se fecha. Fui informada de que nossa localização foi delatada. Mas que saibam os generais: a ordem reina em Berlim! Vossos lacaios cantam vitória cedo demais. A revolução há de amanhã se reerguer rugindo: eu fui, eu sou, eu serei!'
      }
    ],
    isFeatured: true
  },
  {
    id: 'cat-9',
    title: 'As Atas Secretas da Constituinte Republicana de 1891',
    author: 'Comissão Especial dos 21',
    year: 1891,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. Transcrição fidedigna das deliberações em sessões secretas sobre o presidencialismo militar de Deodoro da Fonseca, a secularização dos cemitérios e a separação entre Igreja e Estado.',
    pages: 310,
    publisher: 'Arquivo Nacional / Edição Crítica Adversus Omnes',
    politicalMovement: 'Republicanismo Histórico',
    period: 'Século XIX',
    event: 'Promulgação da 1ª Constituição Republicana',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Sessão Secreta de 12 de Dezembro de 1890',
        content: 'Debate acalorado entre Rui Barbosa e os oficiais florianistas. Discute-se a subordinação das forças armadas ao presidente eleito ou se o exército deve manter o papel tutelar permanente da ordem pública.'
      },
      {
        pageNumber: 2,
        title: 'Sessão Secreta de 28 de Janeiro de 1891',
        content: 'Votação nominal sobre a extinção dos títulos de nobreza monárquicos e confisco das propriedades imperiais não regularizadas. Ocorrência de incidentes nas galerias.'
      }
    ],
    isFeatured: false
  },
  {
    id: 'cat-10',
    title: 'Correspondência Filosófica Inédita: Hannah Arendt e Karl Jaspers (1945–1948)',
    author: 'Hannah Arendt',
    authorId: 'author-5',
    year: 1948,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. O diálogo imediato pós-queda do Terceiro Reich, a culpa metafísica, a reconstrução da universidade e a formulação inicial dos conceitos de totalitarismo.',
    pages: 188,
    publisher: 'Adversus Omnes Digital',
    politicalMovement: 'Filosofia Política Republicana',
    period: 'Século XX',
    event: 'Fim da Segunda Guerra Mundial e Julgamentos de Nuremberg',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Carta de Nova York (Outubro de 1945)',
        content: 'Caro Jaspers, a vitória militar não dissipou a névoa que envolve a Europa. Os campos de concentração introduziram uma categoria de crime que o vocabulário jurídico tradicional é incapaz de julgar. Aqui nos Estados Unidos, há um otimismo cego que me assusta profundamente.'
      },
      {
        pageNumber: 2,
        title: 'Reflexões sobre a Responsabilidade Coletiva',
        content: 'A política não é moral aplicada, mas o espaço onde homens livres agem em conjunto. Quando o Estado totalitário transforma a legalidade em mero instrumento de extermínio organizado, a desobediência civil torna-se a última obrigação do cidadão que se recusa a ser cúmplice.'
      }
    ],
    isFeatured: true
  },

  // ------------------------------------------------------------------
  // ACERVO HISTÓRICO INTEGRALISTA & NACIONALISTA — EXCLUSIVO PARA ASSINANTES
  // ------------------------------------------------------------------
  {
    id: 'cat-11',
    title: 'A Ronda dos Séculos (4ª Edição Histórica)',
    author: 'Gustavo Barroso',
    authorId: 'author-gustavo-barroso',
    year: 1937,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: '/covers/a_ronda_dos_seculos.webp',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. 4ª edição comemorativa da Livraria José Olympio Editora. Grande panorama em prosa lírica e épica das eras históricas: Antiguidade, Idade Média, Renascimento, Grandes Navegações e a Primeira Guerra Mundial.',
    pages: 288,
    publisher: 'Livraria José Olympio Editora (Rio de Janeiro)',
    politicalMovement: 'Integralismo / Tradicionalismo Histórico',
    period: 'Século XX',
    event: 'Panorama Civilizacional e Crítica Histórica',
    downloadUrl: 'https://drive.google.com/uc?id=1BMINLmZbwpxZiddU1r3ks-FmCZnCXx6j&export=download',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Frontispício da 4ª Edição (José Olympio)',
        content: 'GUSTAVO BARROSO, da Academia Brasileira de Letras — A RONDA DOS SÉCULOS (4ª Edição).\n\nLivraria José Olympio Editora — Rua do Ouvidor, 110, Rio de Janeiro.\n\nEvocação panorâmica do destino trágico e heroico das civilizações humanas através das eras históricas.'
      },
      {
        pageNumber: 2,
        title: 'Idade Média: A Espada do Rei Dagoberto',
        content: 'Na penumbra das velhas catedrais e sob o silêncio denso das florestas renanas, a cavalaria forjava a sua armadura espiritual. A espada do rei Dagoberto não era um mero instrumento de conquista territorial, mas o símbolo do dever supremo da autoridade: proteger os deserdados e submeter a força bruta à honra inabalável.'
      },
      {
        pageNumber: 3,
        title: 'Reforma e Renascimento: A Espiã',
        content: 'Nas cortes de Florença e Ferrara, entre brocados e intrigas secretas, o Renascimento despontava sob a duplicidade do fausto e da traição palaciana. As palavras sussurradas em latim humanista valiam mais do que punhais de ferro, selando o destino de principados inteiros.'
      },
      {
        pageNumber: 4,
        title: 'Na Era dos Descobrimentos: Antropófagos',
        content: 'As caravelas portuguesas romperam as brumas do mar ignoto para plantar o padrão das quinas na praia bravia da Terra de Santa Cruz. Diante da voragem dos canibais da floresta virgem, a cruz de madeira erguida pelos missionários inaugurou a epopeia heroica da catequese e da penetração sertaneja.'
      },
      {
        pageNumber: 5,
        title: 'A Grande Guerra: A Alma de Marko Kralievitch',
        content: '1914. Nas trincheiras frias dos Balcãs, onde o ferro e a fumaça de artilharia dilaceravam as esperanças do século, a lenda guerreira de Marko Kralievitch ecoava no canto dos soldados. A técnica mecanizada podia aniquilar a carne, mas era impotente para dobrar o espírito eterno dos povos livres.'
      }
    ],
    isFeatured: true
  },
  {
    id: 'cat-12',
    title: 'As "Vestais Paridas": Memórias e Discursos Parlamentares',
    author: 'Abel Rafael Pinto',
    authorId: 'author-abel-rafael-pinto',
    year: 1984,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: '/covers/as_vestais_paridas.webp',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. Relato confessional e histórico de Abel Rafael Pinto sobre 50 anos de vida política: a adesão à AIB em 1935, a fundação do Partido de Representação Popular (PRP) em 1945 e os bastidores das tribunas parlamentares em Minas Gerais e Brasília.',
    pages: 178,
    publisher: 'Edição do Autor / Arquivo Histórico',
    politicalMovement: 'Integralismo / Doutrina do Sigma (PRP)',
    period: 'Século XX',
    event: 'Atuação Parlamentar e Resistência Democrática Pós-1937',
    downloadUrl: 'https://drive.google.com/uc?id=1ycOOdufF47_0QWYFvAjo9L5FJJSk2QP8&export=download',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Introdução: Do Integralismo à Atuação Parlamentar',
        content: 'Em 1935 entrei para a Ação Integralista Brasileira, em Juiz de Fora. E nunca mais parei em minhas atividades políticas. No Integralismo fui Secretário de Propaganda Municipal e Secretário de Educação Física. Comandei cerca de 700 milicianos na célebre parada de 1º de novembro de 1937, no Rio de Janeiro. Durante o período das "catacumbas", isto é, das perseguições do Estado Novo, fui Chefe Municipal em Juiz de Fora.'
      },
      {
        pageNumber: 2,
        title: 'A Fundação do PRP e a Trajetória Eleitoral',
        content: 'Em 1945, quando fundamos o Partido de Representação Popular, fui Secretário do Diretório Municipal de Juiz de Fora; mais tarde membro do Diretório Estadual e seu Presidente e membro do Diretório Nacional. Fui vereador do PRP à Câmara Municipal de 1947 a 1950. Elegi-me deputado federal em 1958 e reeleito em 1962, ocupando também a Secretaria de Agricultura de Minas Gerais.'
      },
      {
        pageNumber: 3,
        title: 'O Enigma das "Vestais Paridas"',
        content: 'Até mesmo as "vestais paridas" eram homens de grande valor pessoal, claudicando apenas nas questões partidárias, em que se incendiavam de paixão. Lutei muito na Câmara, mas não deixei inimigos. Sempre fiz questão de distinguir entre o homem e o político; o homem e suas ideias; a atuação pública e o respeito à dignidade individual.'
      },
      {
        pageNumber: 4,
        title: 'Epílogo de 1984: Balanço de Meio Século',
        content: 'Estamos em 1984. Os fatos estão aí e respondem, por si mesmos, o que afirmei nos discursos parlamentares transcritos. Revolução, como ensinava Alberto Torres, é a mudança de atitudes em face dos fatos. Uma Nação sem Deus, com a moral corroída e a família fragilizada, perde a sua substância histórica. Por isso continuo lutando: Deus, Pátria e Família!'
      }
    ],
    isFeatured: true
  },
  {
    id: 'cat-13',
    title: 'O Cavaleiro de Itararé (5ª Edição Histórica)',
    author: 'Plínio Salgado',
    authorId: 'author-plinio-salgado',
    year: 1932,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: '/covers/o_cavaleiro_de_itarare.webp',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. 5ª edição com prefácio de Gumercindo Rocha Dórea (Editora Voz do Oeste / INL / MEC). O romance histórico que imortalizou a mocidade nos levantes dos anos 1920 e 1930: os 18 de Copacabana, a Coluna Prestes e a Revolução Constitucionalista.',
    pages: 345,
    publisher: 'Editora Voz do Oeste / Instituto Nacional do Livro (MEC)',
    politicalMovement: 'Modernismo Verde-Amarelo / Integralismo',
    period: 'Século XX',
    event: 'Tenentismo, Revolução de 1930 e Revolução Constitucionalista de 1932',
    downloadUrl: 'https://drive.google.com/uc?id=1fs_2Bj5CtoN8WLbCKiocBcUTLPiBLXRS&export=download',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Prefácio Histórico por Gumercindo Rocha Dórea',
        content: 'Esta nova edição de "O Cavaleiro de Itararé" vem a lume no ano que antecede o cinquentenário da Revolução de 1930, permitindo aos que hoje tomam assento nas assembleias representativas e a uma juventude ávida de verdade o conhecimento de uma época decisiva através de uma das penas mais vigorosas e líricas das letras brasileiras.'
      },
      {
        pageNumber: 2,
        title: 'Capítulo I: Os 18 de Copacabana e o Despertar da Mocidade',
        content: 'Julho de 1922. A praia de Copacabana tremia sob as salvas do forte amotinado. Um punhado de tenentes marchava a peito aberto contra as forças legalistas da República Velha. Não era apenas um levante de quartel, mas o grito de revolta de uma geração inteira que não suportava mais ver o Brasil negociado no balcão das oligarquias cafeeiras.'
      },
      {
        pageNumber: 3,
        title: 'Capítulo II: A Marcha Épica da Coluna pelos Chapadões',
        content: 'Pelos sertões sem fim do Centro-Oeste, cavaleiros empoeirados rasgavam as distâncias do abandono nacional. A Coluna marchava sem abastecimento regular, sustentada pelo entusiasmo e pela mística cívica de que a soberania do povo brasileiro precisava ser resgatada do esquecimento das capitanias eleitorais.'
      },
      {
        pageNumber: 4,
        title: 'Capítulo III: A Névoa de Itararé e o Destino da Pátria',
        content: 'Outubro de 1930. Na estação ferroviária de Itararé, o frio paranaense envolvia os destacamentos armados sob um suspense que paralisava a República. O Cavaleiro de Itararé surge das sombras como a sentinela atenta de um país que teimava em renascer das cinzas do passado oligárquico.'
      }
    ],
    isFeatured: true
  },
  {
    id: 'cat-14',
    title: '13 Anos em Brasília: Ação Parlamentar e o Sonho dos Bandeirantes',
    author: 'Plínio Salgado',
    authorId: 'author-plinio-salgado',
    year: 1973,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: '/covers/treze_anos_em_brasilia.webp',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. Edição histórica Asteca registrando os discursos e conferências parlamentares de Plínio Salgado no Congresso Nacional (1959–1972). Exemplar com dedicatória original preservada, abordando a interiorização do país e o papel civilizatório de Brasília.',
    pages: 191,
    publisher: 'Edição Asteca / Coleção da Câmara dos Deputados',
    politicalMovement: 'Pensamento Político Nacionalista / Representação Parlamentar',
    period: 'Século XX',
    event: 'Construção de Brasília e Interiorização da República',
    downloadUrl: 'https://drive.google.com/uc?id=1uNvQr8EWlIrlgPU1wrK3eW_X9MhSWY6P&export=download',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Frontispício e Dedicatória Manuscrita de 1920/2020',
        content: 'Exemplar com dedicatória histórica manuscrita na guarda: "Dedico este singelo presente ao ilustre amigo Auriberto, que possa compreender através dessas páginas o resultado da epopeia dos bandeirantes."\n\n13 ANOS EM BRASÍLIA (1959–1972) — Intervenções parlamentares, debates orçamentários e projetos de lei apresentados pelo deputado Plínio Salgado.'
      },
      {
        pageNumber: 2,
        title: 'O Sonho dos Bandeirantes: A Convocação dos Pioneiros',
        content: 'Vou fazer a chamada dos heróis para que venham ver Brasília. Para verem a consequência gloriosa do que fizeram conquistando o Oeste e a Amazônia e integrando o vastíssimo território na Pátria Brasileira.\n\nComeço a chamar pelos que desbravaram sertões no século XVI: Jorge Dias e Sebastião Tourinho, exploradores do rio São Francisco e do rio Doce; Paulo Afonso, Gabriel Soares, Antônio Dias Adorno...'
      },
      {
        pageNumber: 3,
        title: 'A Epopeia no Século XVII e XVIII',
        content: 'Passo ao século XVII, com o gigante de botas de sete-léguas, Raposo Tavares, que andou do Sul ao Norte e do Leste ao Oeste, indo até a Bolívia e volvendo pelo rio Madeira ao curso do Amazonas. Chamo Fernão Dias, o caçador de esmeraldas; Borba Gato; Garcia Rodrigues; e Bartolomeu Bueno da Silva, o Anhanguera, que incendiou as águas e desvendou Goiás.'
      },
      {
        pageNumber: 4,
        title: 'Vêde Brasília: O Testamento Continental',
        content: 'Vêde Brasília, erguendo-se imponente nos sertões que perlustrastes. Orgulhai-vos da nossa geração como nós nos orgulhamos de vós. Fostes capazes de idealizar, nós fomos capazes de continuar e, finalmente, de realizar. Como o amplíssimo território que nos legastes, no espaço continental, com unidade de idioma e de sentido político, nós nos integramos na certeza da permanência histórica da Grande Pátria!'
      }
    ],
    isFeatured: true
  },
  {
    id: 'cat-15',
    title: 'Madrugada do Espírito: Súmula Filosófico-Política',
    author: 'Plínio Salgado',
    authorId: 'author-plinio-salgado',
    year: 1946,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: '/covers/madrugada_do_espirito.webp',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. Publicada em Lisboa pela Editora Pro Domo (Coleção Cultura Política). Uma das mais densas exposições filosóficas de Plínio Salgado, refutando o materialismo de Marx e Hegel e afirmando a centralidade da pessoa humana, da família orgânica e da ética cristã.',
    pages: 168,
    publisher: 'Editora Pro Domo / Livraria Ática (Lisboa)',
    politicalMovement: 'Espiritualismo / Filosofia Política Integralista',
    period: 'Século XX',
    event: 'Debates do Pós-Guerra e Doutrina Social do Homem Integral',
    downloadUrl: 'https://drive.google.com/uc?id=1a6e7gaa6aa3-cO6iGJjv-ri3Lk64wI09&export=download',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Frontispício da Edição de Lisboa (1946)',
        content: 'COLEÇÃO CULTURA POLÍTICA, Nº 11. Composto e impresso na Gráfica Santelmo, Rua de S. Bernardo, 84 — Lisboa.\n\n"Madrugada do Espírito" reúne os ensaios de reflexão filosófica redigidos entre 1931 e 1936 sobre o ocaso do racionalismo mecanicista e a aurora da dignidade espiritual do homem.'
      },
      {
        pageNumber: 2,
        title: 'Gigantes da Montanha e Anões de Nibelungos',
        content: 'Depois de Hegel, o pensamento europeu desceu a ladeira do mecanicismo. Marx tentou inverter a dialética hegeliana colocando-a de cabeça para baixo, mas não fez mais do que reduzir todo o mistério da alma humana a uma equação de estômago e ferramentas de produção. O panorama burguês gerou um conformismo materialista tão estéril quanto a utopia burocrática.'
      },
      {
        pageNumber: 3,
        title: 'Capitalismo e Comunismo: Identidade de Origens',
        content: 'Capitalismo financeiro e comunismo coletivista partilham a mesmíssima matriz ontológica: a submissão total da pessoa à matéria. Um atomiza o homem no isolamento egoísta do lucro; outro dissolve a individualidade na máquina estatal. Ambos ignoram que o homem é um ser com aspirações transcendentais que transcendem os limites econômicos.'
      },
      {
        pageNumber: 4,
        title: 'A Revolução da Família e a Concepção Integral do Trabalho',
        content: 'A família é a primeira e mais sólida trincheira da liberdade contra o despotismo. O trabalho humano não é mera mercadoria a ser negociada, mas o ato sagrado de colaboração do homem na ordem divina da Criação. A alvorada do espírito principia no momento em que a sociedade reconhece o primado da alma sobre as engrenagens da técnica.'
      }
    ],
    isFeatured: true
  },
  {
    id: 'cat-16',
    title: 'Nosso Brasil (4ª Edição Revista e Ilustrada)',
    author: 'Plínio Salgado',
    authorId: 'author-plinio-salgado',
    year: 1936,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: '/covers/nosso_brasil.webp',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. 4ª edição com reprodução na capa do clássico quadro da Primeira Missa de Victor Meirelles (Editora Voz do Oeste / Secretaria de Cultura de SP). Obra de pedagogia cívica que narra a geografia lírica, a fé e a formação épica do povo brasileiro.',
    pages: 130,
    publisher: 'Editora Voz do Oeste (São Paulo)',
    politicalMovement: 'Pedagogia Cívica / Nacionalismo Cultural',
    period: 'Século XX',
    event: 'Formação Cívica da Juventude e Literatura de Brasilidade',
    downloadUrl: 'https://drive.google.com/uc?id=1yfmq2xHM-gdalZbH2-S5P6exskuaO8Q3&export=download',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Palavras aos Pais e Educadores',
        content: '«Toda a minha preocupação aqui é formar brasileiros pelo coração, pelo estímulo às virtudes, sem o que jamais teremos nem soldados, nem intelectuais e muito menos estadistas.»\n\nNosso Brasil revive aspectos e tradições de nossa Pátria em linguagem límpida e acessível, para incutir no espírito dos jovens o amor filial à terra onde nascemos.'
      },
      {
        pageNumber: 2,
        title: 'Capítulo I: A Terra Abençoada e a Cruz de Cabral',
        content: 'No dia 26 de abril de 1500, Frei Henrique de Coimbra celebrou no ilhéu da Coroa Vermelha a primeira missa. O altar de madeira tosca, erguido sob o dossel das árvores nativas diante dos marinheiros de joelhos e dos índios perplexos, selou a aliança eterna entre a fé cristã e a terra americana. Nascia o Brasil sob o signo da fraternidade e da esperança.'
      },
      {
        pageNumber: 3,
        title: 'Capítulo II: A Marcha dos Rios e das Montanhas',
        content: 'Nenhum outro país possui bacias hidrográficas que abracem o continente com tanta generosidade. O Amazonas, o São Francisco — o rio da unidade nacional —, o Paraná e o Paraguai não são barreiras que dividem, mas estradas líquidas que os pioneiros navegaram para costurar um país unido de norte a sul, falando uma só língua e venerando um só pavilhão.'
      },
      {
        pageNumber: 4,
        title: 'Capítulo III: O Culto aos Antepassados',
        content: 'Não se ama aquilo que não se conhece. Conhecer a história do Brasil é reverenciar os sacrifícios dos jesuítas, o sangue derramado pelos bandeirantes, a tenacidade dos caboclos e a bravura dos soldados de Guararapes e do Riachuelo. Cada geração tem a sagrada missão de transmitir aos filhos a tocha acesa do patriotismo sem mancha.'
      }
    ],
    isFeatured: true
  },
  {
    id: 'cat-17',
    title: 'Oriente: Impressões de Viagens pelo Mediterrâneo',
    author: 'Plínio Salgado',
    authorId: 'author-plinio-salgado',
    year: 1931,
    type: 'digital',
    access: 'exclusive',
    price: 0,
    stock: 9999,
    coverImage: '/covers/oriente.webp',
    description: 'MATERIAL EXCLUSIVO PARA ASSINANTES. Diário de viagem lírico e filosófico pelo Mediterrâneo Oriental, Grécia, Egito e Palestina. A busca pelas fontes primordiais da cultura humana e o choque poético entre as ruínas clássicas e o deserto milenar.',
    pages: 151,
    publisher: 'Edição Histórica (Rio de Janeiro)',
    politicalMovement: 'Modernismo / Literatura de Viagem',
    period: 'Século XX',
    event: 'Viagem ao Mediterrâneo e Meditações Históricas',
    downloadUrl: 'https://drive.google.com/uc?id=1OWHIZLhOUCgwSqYxFUAPzCedTziw60Xy&export=download',
    pdfPages: [
      {
        pageNumber: 1,
        title: 'Partida: O Vapor «Brasile» no Azul do Mediterrâneo',
        content: 'Nosso vapor (o "Brasile") levantou ferros numa tarde esplêndida, de lindo firmamento azul. Era bem o céu da Grécia. Da Grécia das nossas primeiras poesias, naturalmente parnasianas. Era bem o porto do Pireu, onde as nossas estrofes de outrora punham as trirremes decorativas.'
      },
      {
        pageNumber: 2,
        title: 'Capítulo II: A Acrópole de Atenas e o Papiro Seco',
        content: 'Ao subir as pedras gastas do Partenon sob o sol brilhante da Ática, compreende-se por que a harmonia das formas gregas resistiu aos milênios. Não há ali nada de colossal ou opressor; tudo é medida, simetria e ritmo do espírito. No entanto, faltava àquela civilização sublime o calor da caridade que mais tarde desceria das colinas da Judeia para abraçar a humanidade.'
      },
      {
        pageNumber: 3,
        title: 'Capítulo III: As Areias do Egito e as Pirâmides',
        content: 'O Nilo serpenteia pelo deserto como uma artéria de vida pulsando através do mar de areia. As pirâmides de Gizé erguem-se contra o crepúsculo como sentinelas do silêncio eterno. O cavaleiro no dorso do dromedário contempla o horizonte onde a história dos homens parece tão efêmera quanto a poeira que o vento do deserto dispersa ao entardecer.'
      },
      {
        pageNumber: 4,
        title: 'Capítulo IV: O Encontro com a Terra Santa',
        content: 'Jerusalém é a cidade onde a terra toca o infinito. Pelas vielas de pedra calcária desgastadas por passos de peregrinos de todas as línguas e raças, o viajante sente a palpitação viva da promessa bíblica. O Oriente não é um museu do passado, mas a nascente viva da qual a alma ocidental bebeu a sua sede de eternidade.'
      }
    ],
    isFeatured: true
  }
];

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-curioso',
    name: 'Leitor Curioso',
    badge: 'Acesso Básico',
    priceMonthly: 29.90,
    priceYearly: 299.00,
    description: 'Ideal para amantes da leitura que desejam explorar artigos aprofundados e clássicos digitais.',
    features: [
      'Acesso ilimitado a todos os artigos do Blog cultural',
      'Leitura protegida de todo o Acervo Digital Exclusivo',
      'Downloads ilimitados de documentos históricos de domínio público',
      'Boletim quinzenal de lançamentos e raridades garimpadas'
    ],
    isPopular: false
  },
  {
    id: 'plan-pesquisador',
    name: 'Pesquisador',
    badge: 'Mais Popular',
    priceMonthly: 59.90,
    priceYearly: 599.00,
    description: 'Perfeito para acadêmicos, historiadores e colecionadores que buscam acervo crítico e vantagens no acervo físico.',
    features: [
      'Tudo do Plano Leitor Curioso',
      '15% de desconto vitalício em qualquer livro do Acervo Físico',
      'Acesso a transcrições inéditas e fac-símiles em alta definição',
      'Acesso antecipado de 48h a novos livros raros e primeiras edições',
      'Suporte prioritário na busca de obras sob encomenda'
    ],
    isPopular: true
  },
  {
    id: 'plan-circulo',
    name: 'Membro do Círculo',
    badge: 'Edição Bibliófilo',
    priceMonthly: 119.90,
    priceYearly: 1190.00,
    description: 'A experiência máxima para bibliófilos e apoiadores da preservação histórica documental.',
    features: [
      'Tudo do Plano Pesquisador',
      '20% de desconto em todo o acervo físico',
      'Frete Grátis SEDEX ilimitado para todo o Brasil em compras físicas',
      'Envio semestral de 1 livro raro/usado selecionado pela nossa curadoria na sua porta',
      'Certificado nominal de membro benemérito de Adversus Omnes'
    ],
    isPopular: false
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'BEMVINDO10',
    discountPercentage: 10,
    validUntil: '2026-12-31',
    active: true
  },
  {
    code: 'CONTRAHOMINES20',
    discountPercentage: 20,
    validUntil: '2026-12-31',
    active: true
  },
  {
    code: 'CONTRASTE20',
    discountPercentage: 20,
    validUntil: '2026-12-31',
    active: true
  },
  {
    code: 'HISTORIA15',
    discountPercentage: 15,
    validUntil: '2026-12-31',
    active: true
  }
];

export const INITIAL_INFINITEPAY_CONFIG: InfinitePayConfig = {
  merchantId: 'inf_merch_live_83921049281',
  apiKey: 'inf_live_key_9f9301824a87c10b91e847',
  clientSecret: 'inf_sec_8921b7c4a10',
  walletId: 'inf_wallet_contas_adversusomnes_br',
  mode: 'sandbox',
  webhookUrl: 'https://adversus-omnes.luizeduardociarallo.workers.dev/api/webhooks/infinitepay',
  enabled: true
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9842',
    userId: 'user-subscriber',
    customerName: 'Dra. Helena Magalhães',
    customerEmail: 'helena.magalhaes@universidade.edu.br',
    items: [
      {
        id: 'cat-1',
        title: 'A Democracia na América (2 Volumes em Caixa Especial)',
        price: 480.00,
        quantity: 1,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        condition: 'Raro / Peça Única'
      }
    ],
    subtotal: 480.00,
    discount: 48.00,
    couponCode: 'BEMVINDO10',
    shippingMethod: 'SEDEX',
    shippingPrice: 32.50,
    total: 464.50,
    shippingAddress: {
      cep: '01310-200',
      street: 'Avenida Paulista',
      number: '1578',
      complement: 'Apto 1402',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP'
    },
    paymentGateway: 'infinitepay',
    paymentStatus: 'paid',
    paymentMethod: 'pix',
    trackingCode: 'BR948201490AA',
    createdAt: '2026-09-08T14:32:00Z'
  },
  {
    id: 'ORD-9843',
    userId: 'user-subscriber',
    customerName: 'Rodrigo Fonseca Silveira',
    customerEmail: 'rodrigo.fonseca@cultura.org.br',
    items: [
      {
        id: 'cat-3',
        title: 'Reforma ou Revolução? (Edição Histórica em Brochura)',
        price: 340.00,
        quantity: 1,
        coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
        condition: 'Usado - Excelente'
      }
    ],
    subtotal: 340.00,
    discount: 0,
    shippingMethod: 'PAC',
    shippingPrice: 22.00,
    total: 362.00,
    shippingAddress: {
      cep: '22041-011',
      street: 'Rua Barata Ribeiro',
      number: '450',
      complement: 'Bloco B, Sala 301',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    paymentGateway: 'infinitepay',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    trackingCode: 'BR948201491AA',
    createdAt: '2026-09-09T18:15:00Z'
  }
];
