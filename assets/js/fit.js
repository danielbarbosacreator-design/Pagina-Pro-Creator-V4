/* Seção "O Pro Creator funciona para o seu tipo de empresa?" (#serve-para-mim).
   Carregado sob demanda (quando a seção se aproxima da tela ou o campo recebe foco), não pesa no carregamento inicial.
   Respostas curadas por segmento + correspondência por palavras-chave, tudo no navegador: sem IA, sem custo, sem envio do texto.
   REGRAS: só funcionalidades reais; nada do que é de plano superior (equipe, Asaas) é prometido na Licença Vitalícia.
   Analytics: o texto digitado NUNCA é enviado; só o id do segmento detectado. */
(function () {
  'use strict';
  var root = document.getElementById('serve-para-mim');
  if (!root || root.__fitReady) return;
  root.__fitReady = true;

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /* k = palavras-chave (sem acento, minúsculas; casam no início de palavra). */
  var S = [
    { id: 'ar_condicionado', name: 'instalação e manutenção de ar-condicionado',
      k: ['ar condicionado', 'ar-condicionado', 'climatiza', 'refrigera', 'split', 'hvac', 'camara fria'],
      intro: 'Empresa de ar-condicionado vive de orçamento rápido, visita técnica e cliente que volta para limpeza e manutenção. O Pro Creator organiza esse ciclo: do orçamento da instalação até o recibo do serviço feito, com a marca da sua empresa em cada documento.',
      b: ['Orçamento de instalação com equipamento, material (tubulação, suporte) e mão de obra separados, enviado por link ou PDF ainda na visita.',
          'Você vê quando o cliente abriu a proposta e recebe a aprovação online, sem ficar cobrando no WhatsApp.',
          'Ordem de serviço para cada instalação ou manutenção, com o que foi feito registrado.',
          'Histórico por cliente: quando instalou, o que foi feito, quanto cobrou. Fica fácil oferecer a próxima limpeza.',
          'Recibo com a sua marca na hora de receber.'],
      ex: 'Um cliente pede orçamento de dois splits. Você monta a proposta com equipamentos e instalação, envia o link pelo WhatsApp e vê que ele abriu à noite. Na manhã seguinte ele aprova online, você abre a ordem de serviço da instalação e, no fim, emite o recibo.' },

    { id: 'arquitetura', name: 'arquitetura e design de interiores',
      k: ['arquitet', 'interiores', 'design de interior', 'decorac', 'paisagis', 'urbanis', 'projeto de interior'],
      intro: 'Em arquitetura, a proposta é a primeira entrega do projeto: ela precisa explicar etapas, prazos e valores com a mesma qualidade do seu trabalho. O Pro Creator transforma esse momento em um documento profissional e acompanha o cliente até o contrato assinado.',
      b: ['Proposta por etapas (levantamento, estudo preliminar, anteprojeto, executivo), com valores e prazos claros.',
          'Link de proposta com a sua identidade visual, que o cliente abre no celular e aprova online.',
          'Contrato de prestação de serviço com assinatura digital, sem imprimir nem reconhecer firma.',
          'Saber se o cliente abriu a proposta ajuda a escolher o momento certo de retomar a conversa.',
          'Recibos de cada parcela do projeto para manter o financeiro em dia.'],
      ex: 'Depois da reunião de briefing, você envia a proposta do projeto de interiores por link. O cliente abre, aprova online e você envia o contrato para assinatura digital no mesmo dia. A cada etapa paga, emite o recibo com a sua marca.' },

    { id: 'contabilidade', name: 'escritório de contabilidade',
      k: ['contab', 'contador', 'escritorio contabil', 'bpo', 'fiscal', 'departamento pessoal', 'imposto de renda', 'abertura de empresa'],
      intro: 'Escritório contábil vende serviço recorrente e precisa formalizar bem: o que está incluso no honorário, o que é cobrado à parte e o que o cliente assinou. O Pro Creator organiza a parte comercial do escritório, da proposta de honorários ao contrato assinado.',
      b: ['Proposta de honorários com os serviços inclusos (fiscal, folha, contábil) e os avulsos bem separados.',
          'Contrato de prestação de serviços contábeis com assinatura digital, guardado junto com o cliente.',
          'Acompanhamento das propostas enviadas: quem abriu, quem aprovou, quem ainda precisa de retorno.',
          'Recibos e financeiro básico para registrar o que entrou de honorários e serviços avulsos.'],
      ex: 'Uma empresa pede cotação para trocar de contador. Você envia a proposta de honorários por link, ela é aprovada online e o contrato vai para assinatura digital. Serviços avulsos, como uma alteração contratual, viram outra proposta e recibo.' },

    { id: 'marketing', name: 'agência de marketing e social media',
      k: ['marketing', 'agencia', 'social media', 'midias sociais', 'redes sociais', 'trafego pago', 'gestor de trafego', 'publicidade', 'propaganda', 'conteudo', 'influenc'],
      intro: 'Agência ganha ou perde cliente na proposta: escopo claro, entregáveis definidos e aparência à altura do que você vende. O Pro Creator dá à sua agência propostas com a sua marca, contrato assinado digitalmente e controle de quem já viu o orçamento.',
      b: ['Proposta com pacotes e entregáveis (quantidade de posts, campanhas, relatórios), enviada por link profissional.',
          'Notificação de visualização: você sabe se o lead abriu a proposta antes de fazer o follow-up.',
          'Contrato com assinatura digital definindo escopo, prazo e forma de pagamento, o que evita trabalho fora do combinado.',
          'Recibos mensais com a sua marca e financeiro básico para acompanhar o que entrou.'],
      ex: 'Depois da reunião com um restaurante, você envia a proposta de gestão de redes sociais com dois pacotes. Vê que o dono abriu três vezes, liga para tirar dúvidas, ele aprova online e o contrato de 6 meses é assinado digitalmente.' },

    { id: 'design', name: 'design gráfico e branding',
      k: ['design', 'designer', 'branding', 'identidade visual', 'logotipo', 'logo', 'grafic', 'ilustra', 'ux', 'ui'],
      intro: 'Designer vende algo visual, então a proposta também precisa ser. O Pro Creator coloca a sua marca nas propostas e contratos e deixa claro o escopo do trabalho, o número de revisões e a forma de pagamento antes de começar.',
      b: ['Proposta bonita e organizada, com escopo, entregáveis e número de alterações definidos.',
          'Aprovação online do cliente, que fica registrada antes de você começar a criar.',
          'Contrato com assinatura digital para trabalhos maiores, como identidade visual completa.',
          'Recibo de entrada e de saldo final com a sua identidade.'],
      ex: 'Um cliente pede uma identidade visual. Você envia a proposta com logotipo, manual de marca e duas rodadas de ajuste. Ele aprova online, assina o contrato e você emite o recibo da entrada de 50%.' },

    { id: 'construcao', name: 'construção e reformas',
      k: ['constru', 'reforma', 'empreit', 'obra', 'pedreiro', 'alvenaria', 'gesso', 'drywall', 'pintura', 'pintor', 'acabamento', 'piso', 'marmor', 'telhad', 'serralheri', 'vidracari', 'marcenar', 'moveis planejados', 'engenharia civil', 'engenheiro'],
      intro: 'Em obra e reforma, orçamento mal explicado vira discussão no meio do serviço. O Pro Creator ajuda a apresentar o orçamento por etapas, formalizar com contrato assinado e registrar cada pagamento recebido.',
      b: ['Orçamento detalhado por etapa ou ambiente, separando material e mão de obra.',
          'Proposta por link ou PDF com a sua marca, mais profissional que orçamento em papel ou mensagem solta.',
          'Contrato com assinatura digital definindo escopo, prazo e parcelas, o que protege você e o cliente.',
          'Ordens de serviço para organizar as etapas executadas.',
          'Recibo de cada parcela e financeiro básico para saber o que já entrou.'],
      ex: 'Você visita um apartamento para reformar o banheiro. Monta o orçamento com demolição, hidráulica, revestimento e acabamento, envia o link e o cliente aprova. O contrato é assinado digitalmente e cada parcela paga gera um recibo.' },

    { id: 'eletrica', name: 'serviços elétricos',
      k: ['eletric', 'eletricista', 'instalacao eletrica', 'quadro de distribuicao', 'automacao', 'cabeamento', 'spda', 'para raio'],
      intro: 'Eletricista costuma perder tempo e serviço com orçamento feito às pressas no WhatsApp. Com o Pro Creator você envia um orçamento profissional ainda no local e acompanha cada serviço até o recibo.',
      b: ['Orçamento com materiais e mão de obra discriminados, enviado por link ou PDF na hora.',
          'Aprovação online: o cliente aceita pelo celular e fica registrado.',
          'Ordem de serviço para cada atendimento, com o que foi executado.',
          'Recibo com a sua marca e histórico do cliente para os próximos chamados.'],
      ex: 'Um comércio pede a troca do quadro de distribuição. Você monta o orçamento no local, envia o link, o dono aprova online. Você abre a ordem de serviço, executa e entrega o recibo ao final.' },

    { id: 'energia_solar', name: 'energia solar',
      k: ['solar', 'fotovolta', 'painel solar', 'placa solar', 'paineis solares', 'placas solares', 'energia renovavel'],
      intro: 'Venda de energia solar tem ticket alto e decisão demorada: o cliente compara propostas e precisa de confiança para fechar. O Pro Creator ajuda você a apresentar uma proposta profissional, saber quando ela foi aberta e formalizar o fechamento com contrato assinado.',
      b: ['Proposta organizada com kit (módulos, inversor), instalação e condições de pagamento, com a sua marca.',
          'Saber quando o cliente abriu a proposta é decisivo em venda consultiva: você retoma a conversa no momento certo.',
          'Contrato com assinatura digital, sem deslocamento para assinar.',
          'Ordem de serviço da instalação e recibos das parcelas recebidas.'],
      ex: 'Você envia a proposta de um sistema residencial. O cliente abre duas vezes no fim de semana; na segunda você liga, ajusta a condição de pagamento, ele aprova online e o contrato é assinado digitalmente. A instalação vira uma ordem de serviço.',
      note: 'O dimensionamento técnico do sistema (cálculo de geração) continua sendo feito na sua ferramenta de engenharia; o Pro Creator cuida da parte comercial.' },

    { id: 'consultoria', name: 'consultoria',
      k: ['consult', 'assessoria', 'mentor', 'coach', 'treinament', 'auditoria', 'gestao empresarial', 'rh ', 'recursos humanos'],
      intro: 'Consultoria vende conhecimento, e o cliente decide pelo que entende da proposta. O Pro Creator ajuda a mostrar escopo, etapas e investimento de forma clara, e a formalizar o projeto com contrato assinado digitalmente.',
      b: ['Proposta com diagnóstico, etapas, entregáveis e investimento, enviada por link com a sua marca.',
          'Acompanhamento de visualização para fazer o follow-up no tempo certo.',
          'Contrato de consultoria com assinatura digital.',
          'Recibos das parcelas e financeiro básico do que já foi recebido.'],
      ex: 'Depois da reunião de diagnóstico, você envia a proposta de um projeto de 3 meses. O cliente aprova online, assina o contrato digitalmente e você emite o recibo de cada mensalidade do projeto.' },

    { id: 'manutencao', name: 'manutenção e assistência técnica',
      k: ['manutenc', 'assistencia tecnica', 'conserto', 'reparo', 'tecnico', 'eletrodomest', 'celular', 'informatica', 'computador', 'notebook', 'portao', 'elevador', 'hidraul', 'encanador', 'dedetiz', 'piscina', 'jardin', 'limpeza', 'faxina', 'chaveiro'],
      intro: 'Assistência técnica e manutenção têm muitos atendimentos pequenos, e o que se perde é o controle: o que foi orçado, o que foi aprovado, o que foi feito e o que foi pago. O Pro Creator organiza esse fluxo com orçamento, ordem de serviço e recibo.',
      b: ['Orçamento rápido com peças e mão de obra, enviado por link ou PDF para o cliente aprovar.',
          'Ordem de serviço para cada atendimento, com o serviço executado registrado.',
          'Histórico por cliente: o que já foi feito e quando, útil para garantia e retorno.',
          'Recibo com a sua marca na entrega e financeiro básico do que entrou no mês.'],
      ex: 'Um cliente traz um equipamento com defeito. Você envia o orçamento do reparo por link, ele aprova online, você abre a ordem de serviço e, na entrega, emite o recibo. O atendimento fica no histórico dele.' },

    { id: 'ti', name: 'desenvolvimento de sites, sistemas e TI',
      k: ['desenvolv', 'software', 'sistema', 'site', 'aplicativo', 'app ', 'programa', 'ti ', 'tecnologia da informacao', 'suporte de ti', 'redes de computador', 'web'],
      intro: 'Projeto de tecnologia sem escopo bem fechado vira retrabalho. O Pro Creator ajuda você a apresentar escopo, etapas e valores em uma proposta clara e a formalizar tudo com contrato assinado antes de começar.',
      b: ['Proposta com escopo, funcionalidades, prazo e forma de pagamento.',
          'Aprovação online registrada antes do início do projeto.',
          'Contrato com assinatura digital, incluindo condições de suporte e manutenção.',
          'Recibos de entrada, etapas e mensalidades de suporte.'],
      ex: 'Você envia a proposta de um site institucional com três etapas de pagamento. O cliente aprova, assina o contrato digitalmente e cada etapa entregue gera um recibo.' },

    { id: 'fotografia_eventos', name: 'fotografia, vídeo e eventos',
      k: ['fotograf', 'filmag', 'video', 'videomaker', 'evento', 'casamento', 'buffet', 'decoracao de festa', 'cerimonial', 'dj', 'som e luz', 'festa'],
      intro: 'Em fotografia e eventos, a data reservada precisa estar formalizada: pacote, valor, sinal e regras de cancelamento. O Pro Creator ajuda a enviar propostas bonitas e fechar com contrato assinado digitalmente.',
      b: ['Proposta com pacotes (horas de cobertura, entregáveis, extras) e a sua identidade visual.',
          'Saber que o cliente abriu a proposta ajuda a não perder a data para outro fornecedor.',
          'Contrato com assinatura digital com data, sinal e condições de cancelamento.',
          'Recibo do sinal e do saldo, com financeiro básico para acompanhar os eventos fechados.'],
      ex: 'Um casal pede orçamento para o casamento. Você envia a proposta com dois pacotes, eles aprovam online, assinam o contrato digitalmente e você emite o recibo do sinal que garante a data.' },

    { id: 'seguranca_trabalho', name: 'segurança e medicina do trabalho',
      k: ['seguranca do trabalho', 'medicina do trabalho', 'sst', 'pgr', 'pcmso', 'nr ', 'laudo', 'ltcat', 'ocupacional', 'exames admissionais'],
      intro: 'Empresas de SST vendem para outras empresas, que comparam propostas e precisam de documento formal. O Pro Creator ajuda a apresentar serviços e exames em uma proposta organizada e a formalizar com contrato assinado.',
      b: ['Proposta organizada com programas (PGR, PCMSO), laudos e exames, com valores claros.',
          'Envio por link ou PDF, com acompanhamento de visualização.',
          'Contrato com assinatura digital para os serviços contratados.',
          'Recibos e financeiro básico dos serviços prestados.'],
      ex: 'Uma indústria pede cotação de PGR e PCMSO. Você envia a proposta por link, o RH abre e encaminha para a diretoria, a aprovação chega online e o contrato é assinado digitalmente.' },

    { id: 'juridico', name: 'advocacia e serviços jurídicos',
      k: ['advoca', 'advogad', 'juridic', 'escritorio de advocacia', 'despachante'],
      intro: 'Para escritórios jurídicos, o Pro Creator ajuda na parte comercial: apresentar a proposta de honorários de forma profissional, formalizar com contrato assinado digitalmente e registrar o que foi recebido.',
      b: ['Proposta de honorários clara, enviada por link ou PDF com a identidade do escritório.',
          'Contrato de honorários com assinatura digital.',
          'Acompanhamento de quem abriu e aprovou cada proposta.',
          'Recibos e financeiro básico dos honorários recebidos.'],
      ex: 'Um cliente pede orçamento para uma ação. Você envia a proposta de honorários, ele aprova online e assina o contrato digitalmente. A entrada paga gera um recibo.',
      note: 'O Pro Creator não faz gestão de processos, prazos ou andamentos processuais; ele organiza a parte comercial do escritório.' },

    { id: 'saude_estetica', name: 'saúde, estética e bem-estar',
      k: ['clinica', 'estetica', 'salao', 'barbearia', 'psicolog', 'nutricion', 'fisioterap', 'personal', 'odontolog', 'dentista', 'massag', 'spa', 'academia', 'pilates'],
      intro: 'O Pro Creator não é um sistema de agenda ou prontuário. Mas ajuda negócios de saúde e estética na parte comercial: apresentar pacotes e tratamentos em uma proposta profissional, formalizar com contrato e emitir recibos.',
      b: ['Proposta de pacotes ou tratamentos com valores e condições de pagamento.',
          'Aprovação online e contrato com assinatura digital para pacotes e planos.',
          'Recibos com a sua marca para cada pagamento.',
          'Cadastro de clientes com o histórico do que foi contratado.'],
      ex: 'Uma cliente pede valores de um pacote de 10 sessões. Você envia a proposta por link, ela aprova, assina o contrato do pacote e você emite o recibo de cada pagamento.',
      note: 'Agendamento, prontuário e controle de sessões não fazem parte do Pro Creator.' },

    { id: 'comercio', name: 'comércio e loja',
      k: ['loja', 'comercio', 'varejo', 'vendo produto', 'revenda', 'distribuidor', 'atacad', 'e commerce', 'ecommerce', 'mercado', 'restaurante', 'lanchonete', 'padaria'],
      intro: 'O Pro Creator foi feito para quem vende por orçamento e proposta, não para venda de balcão. Ele não tem frente de caixa, estoque nem emissão de nota fiscal. Se a sua loja também faz orçamentos sob encomenda, vendas para empresas ou serviços, aí ele ajuda bastante.',
      b: ['Orçamentos e propostas profissionais para pedidos sob encomenda ou vendas maiores.',
          'Acompanhamento de quem abriu e aprovou cada orçamento.',
          'Recibos com a sua marca e cadastro de clientes organizado.',
          'Ordem de serviço quando há instalação, entrega ou montagem.'],
      ex: 'Uma empresa pede orçamento de 200 peças personalizadas. Você envia a proposta por link, ela aprova online, você registra o pedido como ordem de serviço e emite o recibo do sinal.',
      note: 'PDV, controle de estoque e nota fiscal não fazem parte do Pro Creator.' },

    { id: 'educacao', name: 'cursos, aulas e treinamentos',
      k: ['curso', 'aula', 'professor', 'escola', 'idioma', 'reforco', 'educac', 'instrutor', 'autoescola'],
      intro: 'O Pro Creator não é uma plataforma de cursos nem de gestão escolar. Ele ajuda na parte comercial: enviar propostas de turmas fechadas, treinamentos para empresas e aulas particulares, formalizar com contrato e emitir recibos.',
      b: ['Proposta de treinamento in company ou pacote de aulas com conteúdo, carga horária e valor.',
          'Aprovação online e contrato com assinatura digital.',
          'Recibos das mensalidades ou parcelas com a sua marca.'],
      ex: 'Uma empresa quer um treinamento para a equipe. Você envia a proposta com conteúdo e carga horária, ela aprova online, o contrato é assinado digitalmente e o pagamento gera recibo.',
      note: 'Área do aluno, matrícula online e hospedagem de aulas não fazem parte do Pro Creator.' }
  ];

  var GENERIC = {
    id: 'outro', name: '',
    intro: 'Não temos um roteiro pronto para esse segmento, então vamos ser diretos: o Pro Creator ajuda qualquer empresa que vende por orçamento ou proposta e quer organizar esse processo. Se é o seu caso, estes são os pontos em que ele ajuda.',
    b: ['Orçamentos e propostas profissionais com a sua marca, enviados por link, WhatsApp ou PDF.',
        'Saber quando o cliente abriu a proposta e receber a aprovação online.',
        'Contratos com assinatura digital, sem imprimir nada.',
        'Ordens de serviço, recibos e financeiro básico para registrar o que foi feito e o que entrou.'],
    ex: 'Um cliente pede orçamento. Você monta a proposta no Pro Creator, envia o link, vê quando ele abriu, recebe a aprovação online, formaliza com contrato assinado digitalmente e emite o recibo quando receber.',
    note: 'O Pro Creator não faz PDV, estoque, nota fiscal, agenda nem prontuário. Se a sua operação depende principalmente disso, ele não substitui essas ferramentas.'
  };

  function match(text) {
    var t = ' ' + norm(text) + ' ';
    var best = null, bestScore = 0;
    for (var i = 0; i < S.length; i++) {
      var sc = 0;
      for (var j = 0; j < S[i].k.length; j++) {
        var kw = norm(S[i].k[j]);
        if (!kw) continue;
        if (t.indexOf(' ' + kw) !== -1) sc += kw.length > 6 ? 3 : 2;
      }
      if (sc > bestScore) { bestScore = sc; best = S[i]; }
    }
    return best || GENERIC;
  }

  function track(ev, props) {
    try { if (window.pcAnalytics) window.pcAnalytics.track(ev, props || {}); } catch (e) {}
  }

  var form = root.querySelector('[data-fit-form]');
  var input = root.querySelector('[data-fit-input]');
  var out = root.querySelector('[data-fit-result]');
  var cta = root.querySelector('[data-fit-cta]');
  var err = root.querySelector('[data-fit-error]');
  var current = null;

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  function render(seg) {
    var body = out.querySelector('[data-fit-body]');
    body.textContent = '';
    var title = seg.id === 'outro' ? 'Como o Pro Creator pode ajudar a sua empresa' : 'Como o Pro Creator ajuda em ' + seg.name;
    body.appendChild(el('h3', 'fit-title', title));
    body.appendChild(el('p', 'fit-intro', seg.intro));
    var ul = el('ul', 'fit-list');
    seg.b.slice(0, 5).forEach(function (txt) {
      var li = el('li');
      li.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';
      li.appendChild(document.createTextNode(txt));
      ul.appendChild(li);
    });
    body.appendChild(ul);
    var exb = el('div', 'fit-example');
    exb.appendChild(el('span', 'fit-example-lbl', 'Na prática, no dia a dia'));
    exb.appendChild(el('p', '', seg.ex));
    body.appendChild(exb);
    if (seg.note) body.appendChild(el('p', 'fit-note', seg.note));
    out.hidden = false;
  }

  /* Estado "Analisando seu segmento...": mínimo 1s, alvo ~1,3s, nunca mais que o necessário.
     Cada envio ganha um número; só a última consulta pode exibir resposta (sem resposta antiga). */
  var btn = form.querySelector('button[type="submit"]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loader = el('div', 'fit-loading');
  loader.hidden = true;
  loader.setAttribute('role', 'status');
  loader.innerHTML = '<span class="fit-spinner" aria-hidden="true"></span><div><p class="fit-loading-t">Analisando seu segmento...</p><p class="fit-loading-s">Identificando como o Pro Creator pode ajudar sua empresa.</p></div>';
  out.parentNode.insertBefore(loader, out);
  var seq = 0, busy = false, MIN_MS = 1300;

  function scrollTo(node) {
    var r = node.getBoundingClientRect();
    if (r.top >= 70 && r.bottom <= window.innerHeight) return;
    try { node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); } catch (e) { node.scrollIntoView(); }
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (busy) return;
    var v = (input.value || '').trim();
    if (v.length < 3) { err.hidden = false; input.focus(); return; }
    err.hidden = true;
    var my = ++seq, t0 = Date.now();
    busy = true;
    btn.disabled = true; btn.setAttribute('aria-busy', 'true'); input.readOnly = true;
    out.hidden = true;
    loader.hidden = false;
    scrollTo(loader);
    var seg = match(v); /* resposta local, pronta na hora: a espera é só a mínima */
    track('fit_query_submitted', { segment: seg.id, matched: seg.id !== 'outro' });
    setTimeout(function () {
      if (my !== seq) return;
      current = seg.id;
      loader.hidden = true;
      render(seg);
      busy = false;
      btn.disabled = false; btn.removeAttribute('aria-busy'); input.readOnly = false;
      track('fit_query_completed', { segment: seg.id, matched: seg.id !== 'outro' });
      scrollTo(out.querySelector('.fit-title') || out);
      var h = out.querySelector('.fit-title'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }, Math.max(0, MIN_MS - (Date.now() - t0)));
  });

  input.addEventListener('input', function () { if (!err.hidden && input.value.trim().length >= 3) err.hidden = true; });

  /* O clique de compra já gera purchase_button_clicked (cta_id fit_resposta) pelo pc-track; aqui só o segmento. */
  if (cta) cta.addEventListener('click', function () { track('fit_cta_clicked', { segment: current || 'nenhum' }); });

  window.__pcFitMatch = match; /* usado só em testes */
})();
