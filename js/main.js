document.addEventListener('DOMContentLoaded', () => {

  let slotAtivo = null;
  let buildArmaPrimaria = {
    arma: null,
    mod: null,
    calibracao: null
  };
  let buildCradles = {};
  let listaAtualNoModal = [];
  let categoriaAtualNoModal = null;

  // CAPTURAR OS ELEMENTOS IMPORTANTES DO HTML
  const appContainer = document.getElementById('app');
  const campoBusca = document.getElementById('campo-busca');
  const modal = document.getElementById('modal-selecao');
  const modalBtnFechar = document.getElementById('modal-btn-fechar');

  // FUNÇÃO PARA RENDERIZAR OS CARDS 
  function criarCardHTML(item, tipo) {

    // Dentro da sua função criarCardHTML...

    if (tipo === 'arma') {
      return `
        <div class="card-arma item-selecionavel" data-id="${item.id}">
            <div class="card-imagem">
                <img src="${item.imagemUrl}" alt="Imagem da ${item.nome}">
            </div>
            <div class="card-conteudo">
                <span class="raridade-card raridade-${item.raridade.toLowerCase()}">${item.raridade}</span>
                <h3>${item.nome}</h3>
                <p class="info-tier">
                    <span>⭐ Tier ${item.tier}</span> | <span>${item.fabricante}</span>
                </p>
                
                <div class="atributos-container">
                    <p class="info-atributo"><span>DMG</span> <span>${item.status_base.dano}</span></p>
                    <p class="info-atributo"><span>Crit Rate</span> <span>+${item.atributos_primarios.taxa_critico}%</span></p>
                    <p class="info-atributo"><span>Crit DMG</span> <span>+${item.atributos_primarios.dano_critico}%</span></p>
                    <p class="info-atributo"><span>Weakspot DMG</span> <span>+${item.atributos_primarios.dano_ponto_fraco}%</span></p>
                </div>
            </div>
        </div>
    `;
    } else if (tipo === 'armadura') {
      return `
        <div class="card-arma item-selecionavel" data-id="${item.id}">
            <div class="card-imagem">
                <img src="${item.imagemUrl}" alt="Imagem da ${item.nome}">
            </div>
            <div class="card-conteudo">
                <span class="raridade-card raridade-${item.raridade.toLowerCase()}">${item.raridade}</span>
                <h3>${item.nome}</h3>
                <p class="info-tier">
                    <span>⭐ Tier ${item.tier}</span> | <span>${item.fabricante}</span>
                </p>
                
                <div class="atributos-container">
                    <p class="info-atributo">HP: +${item.atributos_primarios.vida_maxima}</p>
                    <p class="info-atributo">Pollution Resist: +${item.atributos_primarios.resistencia_poluicao}</p>
                    <p class="info-atributo">Psi Intensity: +${item.atributos_primarios.intensidade_psi}</p>
                    <p class="info-atributo">Durability: ${item.durabilidade}</p>
                </div>
            </div>
        </div>
    `;
    } else if (tipo === 'calibracao') {

      // Primeiro, a gente monta o HTML dos atributos
      const atributosHTML = item.atributos.map(attr =>
        `<p><strong>${attr.nome}:</strong> +${attr.valor_min}% - ${attr.valor_max}%</p>`
      ).join('');

      // Depois, a gente retorna o card completo
      return `
            <div class="card-arma item-selecionavel" data-id="${item.id}">
                <div class="card-imagem">
                    <img src="${item.imagemUrl}" alt="Imagem da ${item.nome}">
                </div>
                <div class="card-conteudo">
                    <h3>${item.nome} (${item.raridade})</h3>
                    <p><strong>Efeito:</strong> ${item.efeito_unico}</p>
                    <hr>
                    <h4>Atributos:</h4>
                    ${atributosHTML}
                </div>
            </div>
        `;
    } else if (tipo === 'mod') {
      return `
        <div class="card-arma item-selecionavel" data-id="${item.id}">
            <div class="card-imagem">
                <img src="${item.imagemUrl}" alt="Imagem de ${item.nome}">
            </div>
            <div class="card-conteudo">
                <h3>${item.nome} (${item.raridade})</h3>
                <p><strong>Efeito:</strong> ${item.efeito_especial}</p>
            </div>
        </div>
    `;
    } else if (tipo === 'cradle') {
      return `
        <div class="card-arma item-selecionavel" data-id="${item.id}">
            <div class="card-imagem">
                <img src="${item.imagemUrl}" alt="Imagem de ${item.nome}">
            </div>
            <div class="card-conteudo">
                <h3>${item.nome}</h3>
                <p><strong>Tipo:</strong> ${item.tipo}</p>
                <p>${item.descricao}</p>
            </div>
        </div>
    `;
    }

  }

  function renderizarDetalhesArma(itemArma) {
    const painel = document.getElementById('painel-detalhes-arma');

    if (!itemArma) {
      painel.innerHTML = `<p class="placeholder-detalhes">Selecione uma arma para ver os detalhes...</p>`;
      return;
    }

    const keywordInfo = keywords.find(k => k.slug === itemArma.keyword_slug);

    // só vai tentar montar o HTML da "Weapon Feature" SE ela existir no item
    let weaponFeatureHTML = ''; // Começa como uma string vazia
    if (itemArma.weapon_feature && itemArma.weapon_feature.efeitos) {
      const listaDeEfeitos = itemArma.weapon_feature.efeitos.map(efeito =>
        `<li>${efeito}</li>`
      ).join('');

      weaponFeatureHTML = `
            <hr>
            <h4>Weapon Feature: ${itemArma.weapon_feature.titulo}</h4>
            <ul>${listaDeEfeitos}</ul>
        `;
    }

    let htmlCompleto = `
        <div class="detalhes-header">
            <div>
                <h2>${itemArma.nome} (${itemArma.status_base.dano} DMG)</h2>
                <p>${itemArma.fabricante}</p>
            </div>
        </div>
        <div class="detalhes-grid">
            <div>
                <p><strong>DMG:</strong> ${itemArma.status_base.dano}</p>
                <p><strong>Reload:</strong> ${itemArma.status_base.recarga}</p>
                <p><strong>Accuracy:</strong> ${itemArma.status_base.precisao}</p>
            </div>
            <div>
                <p><strong>Fire Rate:</strong> ${itemArma.status_base.cadencia}</p>
                <p><strong>Magazine:</strong> ${itemArma.status_base.carregador}</p>
                <p><strong>Stability:</strong> ${itemArma.status_base.estabilidade}</p>
            </div>
            <div>
                <h4>Equipment Stats</h4>
                <p><strong>Durability:</strong> ${itemArma.durabilidade}</p>
                <p><strong>Weight:</strong> ${itemArma.peso}</p>
                <p><strong>Required Level:</strong> ${itemArma.nivel_requerido}</p>
            </div>
        </div>
        ${weaponFeatureHTML}
        ${keywordInfo ? `<hr><h4>Keyword: ${keywordInfo.titulo}</h4><p>${keywordInfo.descricao}</p>` : ''}
    `;

    // ADICIONA o HTML do mod, se ele existir.
    if (buildArmaPrimaria.mod) {
      const itemMod = buildArmaPrimaria.mod;
      htmlCompleto += `
            <hr>
            <h4>Weapon Mod: ${itemMod.nome}</h4>
            <p>${itemMod.efeito_especial}</p> 
        `;
    }

    // ADICIONA o HTML da calibração, se ela existir.
    if (buildArmaPrimaria.calibracao) {
      const itemCalibracao = buildArmaPrimaria.calibracao;
      const atributosCalibracaoHTML = itemCalibracao.atributos.map(attr =>
        `<p><strong>${attr.nome}:</strong> +${attr.valor_min}% - ${attr.valor_max}%</p>`
      ).join('');

      htmlCompleto += `
            <hr>
            <h4>Calibration: ${itemCalibracao.nome}</h4>
            <p>${itemCalibracao.efeito_unico}</p>
            ${atributosCalibracaoHTML}
        `;
    }

    // renderiza a string completa na tela.
    painel.innerHTML = htmlCompleto;
  }

  function renderizarItens(lista, tipo, container = appContainer) {
    container.innerHTML = ''; // Limpa o container específico

    if (lista.length === 0) {
      container.innerHTML = tipo === 'arma' ? '<p>Nenhum item encontrado...</p>' : '<p>Nenhum item cadastrado...</p>';
      return;
    }

    let htmlParaRenderizar = '';
    lista.forEach(item => {
      htmlParaRenderizar += criarCardHTML(item, tipo);
    });

    container.innerHTML = htmlParaRenderizar; // Renderiza no container certo
  }

  // LÓGICA DO FILTRO DE BUSCA
  campoBusca.addEventListener('input', () => {
    const termoBusca = campoBusca.value.toLowerCase();
    const containerDoModal = document.getElementById('modal-lista-itens');

    // Se a busca estiver vazia, mostra a lista completa que a gente guardou
    if (termoBusca === '') {
      renderizarItens(listaAtualNoModal, categoriaAtualNoModal, containerDoModal);
      return; // Para a execução aqui
    }

    // Filtra a lista que está ATUALMENTE no modal
    const itensFiltrados = listaAtualNoModal.filter(item => {
      return item.nome.toLowerCase().includes(termoBusca);
    });

    // Renderiza o resultado do filtro DENTRO do modal
    renderizarItens(itensFiltrados, categoriaAtualNoModal, containerDoModal);
  });


  // RENDERIZAÇÃO INICIAL
  setupArmaPrimariaView();

  // LÓGICA DE NAVEGAÇÃO DAS ABAS 
  const abas = document.querySelectorAll('.menu-categorias .aba');

  abas.forEach(aba => {
    aba.addEventListener('click', (event) => {
      event.preventDefault();
      abas.forEach(a => a.classList.remove('ativa'));
      aba.classList.add('ativa');

      const categoriaSelecionada = aba.textContent;

      // --- ESTE É O GERENTE DE ABAS ---
      // O trabalho dele é SÓ olhar a categoriaSelecionada

      if (categoriaSelecionada === 'Arma Primária') {

        setupArmaPrimariaView(); // O especialista em slots de arma assume daqui

      } else if (categoriaSelecionada === 'Armadura') {
        campoBusca.style.display = 'none';

        // Aqui a gente monta o cenário da armadura e ativa os slots dela
        const layoutDosSlots = criarLayoutSlotsArmadura();
        appContainer.innerHTML = layoutDosSlots;
        const todosOsSlotsDeArmadura = appContainer.querySelectorAll('.slot');

        todosOsSlotsDeArmadura.forEach(slot => {
          slot.addEventListener('click', (event) => {
            slotAtivo = event.currentTarget;
            const tipoDoSlot = slot.id.replace('build-slot-', '');
            const tipoDoItem = tipoDoSlot.charAt(0).toUpperCase() + tipoDoSlot.slice(1);
            abrirModalComItens(tipoDoItem, 'armadura');
          });
        });

      } else if (categoriaSelecionada === 'Cradles') {
        appContainer.innerHTML = criarLayoutCradles();
        const todosOsSlotsDeCradle = appContainer.querySelectorAll('.slot-circular');
        todosOsSlotsDeCradle.forEach(slot => {
          slot.addEventListener('click', (event) => {
            slotAtivo = event.currentTarget;
            // O tipo é sempre 'Cradle' e a categoria é 'cradle'
            abrirModalComItens('Cradle', 'cradle');
          });
        });

      } else {
        // Para todas as outras abas, mostramos "em construção"
        campoBusca.style.display = 'none';
        appContainer.innerHTML = `<h2>🔧 Conteúdo para "${categoriaSelecionada}" em construção! 🔧</h2>`;
      }
    });
  });

  function criarLayoutSlotsArmadura() {
    return `
        <div class="slots-grid">
            
            <div class="slot-container" id="container-capacete">
                <h4>Capacete</h4>
                <div class="slot" id="build-slot-capacete"><p>Vazio</p></div>
            </div>
            <div class="slot-container" id="container-mod-capacete">
                <h4>Mod do Capacete</h4>
                <div class="slot" id="build-slot-capacete-mod"><p>Vazio</p></div>
            </div>
            <div class="slot-container" id="container-mascara">
                <h4>Máscara</h4>
                <div class="slot" id="build-slot-mascara"><p>Vazio</p></div>
            </div>
            <div class="slot-container" id="container-mod-mascara">
                <h4>Mod da Máscara</h4>
                <div class="slot" id="build-slot-mascara-mod"><p>Vazio</p></div>
            </div>

            <div class="slot-container" id="container-peitoral">
                <h4>Peitoral</h4>
                <div class="slot" id="build-slot-peitoral"><p>Vazio</p></div>
            </div>
            <div class="slot-container" id="container-mod-peitoral">
                <h4>Mod do Peitoral</h4>
                <div class="slot" id="build-slot-peitoral-mod"><p>Vazio</p></div>
            </div>
            <div class="slot-container" id="container-luvas">
                <h4>Luvas</h4>
                <div class="slot" id="build-slot-luvas"><p>Vazio</p></div>
            </div>
            <div class="slot-container" id="container-mod-luvas">
                <h4>Mod das Luvas</h4>
                <div class="slot" id="build-slot-luvas-mod"><p>Vazio</p></div>
            </div>

            <div class="slot-container" id="container-calcas">
                <h4>Calças</h4>
                <div class="slot" id="build-slot-calcas"><p>Vazio</p></div>
            </div>
            <div class="slot-container" id="container-mod-calcas">
                <h4>Mod das Calças</h4>
                <div class="slot" id="build-slot-calcas-mod"><p>Vazio</p></div>
            </div>
            <div class="slot-container" id="container-botas">
                <h4>Botas</h4>
                <div class="slot" id="build-slot-botas"><p>Vazio</p></div>
            </div>
            <div class="slot-container" id="container-mod-botas">
                <h4>Mod das Botas</h4>
                <div class="slot" id="build-slot-botas-mod"><p>Vazio</p></div>
            </div>

        </div>
    `;
  }

  function criarLayoutSlotsArmaPrimaria() {
    return `
        <div class="slots-grid-arma">
            <div class="slot-container" id="container-arma-primaria">
                <h4>Arma Primária</h4>
                <div class="slot" id="build-slot-arma-primaria"><p>Vazio</p></div>
            </div>

            <div class="slot-container" id="container-arma-mod">
                <h4>Mod da Arma</h4>
                <div class="slot" id="build-slot-arma-mod"><p>Vazio</p></div>
            </div>

            <div class="slot-container" id="container-arma-calibracao">
                <h4>Calibração</h4>
                <div class="slot" id="build-slot-arma-calibracao"><p>Vazio</p></div>
            </div>
        </div>

        <div id="painel-detalhes-arma" class="painel-detalhes">
            <p class="placeholder-detalhes">Selecione uma arma para ver os detalhes completos...</p>
        </div>
    `;
  }

  // LÓGICA DO MODAL
  function abrirModal() {
    modal.style.display = 'flex';
  }

  function fecharModal() {
    modal.style.display = 'none';
  }
  modalBtnFechar.addEventListener('click', fecharModal);

  function abrirModalComItens(tipoDeItem, categoria) {
    let listaDeItens = [];

    // 1. PRIMEIRO, a gente decide qual lista usar
    if (categoria === 'arma') {
      if (tipoDeItem === 'todos') {
        listaDeItens = armas;
      } else {
        listaDeItens = armas.filter(item => item.tipo === tipoDeItem);
      }
    } else if (categoria === 'armadura') {
      listaDeItens = armaduras.filter(item => item.tipo === tipoDeItem);
    } else if (categoria === 'calibracao') {
      listaDeItens = calibracoes.filter(item => item.tipo === tipoDeItem);
    } else if (categoria === 'mod') {
      listaDeItens = mods.filter(item => item.tipo === tipoDeItem);
    } else if (categoria === 'cradle') {
      listaDeItens = cradles; // Pega todos os cradles, sem filtro de tipo
    }

    // 2. AGORA, a gente salva na memória
    listaAtualNoModal = listaDeItens;
    categoriaAtualNoModal = categoria;

    // 3. RENDERIZA a lista escolhida dentro do modal
    const containerDoModal = document.getElementById('modal-lista-itens');
    renderizarItens(listaDeItens, categoria, containerDoModal);

    // 4. DEPOIS de renderizar, a gente torna os itens clicáveis
    const itensNoModal = containerDoModal.querySelectorAll('.item-selecionavel');
    itensNoModal.forEach(card => {
      card.addEventListener('click', () => {
        const itemId = parseInt(card.dataset.id);
        if (!isNaN(itemId)) {
          equiparItem(itemId, categoria);
        }
      });
    });

    // 5. E POR ÚLTIMO, a gente abre o modal já pronto
    abrirModal();
  }

  // FUNÇÃO PARA EQUIPAR O ITEM
  function equiparItem(itemId, categoria) {
    let itemParaEquipar = null;

    if (categoria === 'arma') {
      itemParaEquipar = armas.find(item => item.id === itemId);
    } else if (categoria === 'armadura') {
      itemParaEquipar = armaduras.find(item => item.id === itemId);
    } else if (categoria === 'calibracao') {
      itemParaEquipar = calibracoes.find(item => item.id === itemId);
    } else if (categoria === 'mod') {
      itemParaEquipar = mods.find(item => item.id === itemId);
    } else if (categoria === 'cradle') {
      itemParaEquipar = cradles.find(item => item.id === itemId);
    }

    // A gente só faz o resto se o slot e o item existirem
    if (slotAtivo && itemParaEquipar) {
      // Aqui a gente desenha o item dentro do slot clicado
      slotAtivo.innerHTML = `
            <img src="${itemParaEquipar.imagemUrl}" alt="${itemParaEquipar.nome}">
            
        `;
      slotAtivo.classList.add('equipado');
      // Atualiza o nosso "inventário"
      const slotId = slotAtivo.id;
      if (slotId.startsWith('build-slot-cradle-')) {
        buildCradles[slotId] = itemParaEquipar;
      } else if (slotId === 'build-slot-arma-primaria') {
        buildArmaPrimaria.arma = itemParaEquipar;
      } else if (slotId === 'build-slot-arma-mod') {
        buildArmaPrimaria.mod = itemParaEquipar;
      } else if (slotId === 'build-slot-arma-calibracao') {
        buildArmaPrimaria.calibracao = itemParaEquipar;
      }

      // Atualiza o painel de detalhes se for um item da aba de armas
      if (categoria === 'arma' || categoria === 'calibracao' || categoria === 'mod') {
        renderizarDetalhesArma(buildArmaPrimaria.arma);
      }
      if (categoria === 'cradle') {
        renderizarEfeitosCradle();
      }
    }

    fecharModal();
  }

  // INICIALIZA A VIEW DA ARMA PRIMÁRIA
  function setupArmaPrimariaView() {
    appContainer.innerHTML = criarLayoutSlotsArmaPrimaria();
    const todosOsSlotsDeArma = appContainer.querySelectorAll('.slot');

    // Lógica para adicionar o evento de clique em cada slot
    todosOsSlotsDeArma.forEach(slot => {
      slot.addEventListener('click', (event) => {
        slotAtivo = event.currentTarget;
        const slotId = slot.id;

        if (slotId === 'build-slot-arma-primaria') {
          // AQUI! Em vez de pedir um tipo específico, pedimos 'todos'!
          abrirModalComItens('todos', 'arma');

        } else if (slotId === 'build-slot-arma-mod') {
          abrirModalComItens('Mod de Arma', 'mod');
        } else if (slotId === 'build-slot-arma-calibracao') {
          abrirModalComItens('Calibração', 'calibracao');
        }
      });
    });
  }

  function criarLayoutCradles() {
    let slotsHTML = ''; // Começa uma string vazia para os slots

    // Loop que roda 8 vezes para criar os 8 slots
    for (let i = 1; i <= 8; i++) {
      slotsHTML += `
            <div class="cradle-slot-container">
                <div class="slot-circular" id="build-slot-cradle-${i}"></div>
                <p>Slot ${i}</p>
            </div>
        `;
    }

    // Retorna o HTML completo da view
    return `
        <div class="cradles-view">
            <h2>Cradle Slots</h2>
            <p class="view-subtitle">Select cradles to enhance your build's capabilities</p>
            <div class="cradle-slots-grid">${slotsHTML}</div>
        
            <div id="cradle-effects-container">
                </div>
        </div>
    `;
  }

  function renderizarEfeitosCradle() {
    const container = document.getElementById('cradle-effects-container');

    // Pega só os itens que estão dentro do nosso objeto de inventário
    const cradlesEquipados = Object.values(buildCradles);

    // Se não tiver nenhum cradle equipado, a gente limpa a área e para por aqui
    if (cradlesEquipados.length === 0) {
      container.innerHTML = '';
      return;
    }

    // Se tiver itens, a gente monta o HTML
    container.innerHTML = `
        <h3 class="effects-title">Cradle Effects</h3>
        <div class="effects-grid">
            ${cradlesEquipados.map(item => `
                <div class="effect-card">
                    <img src="${item.imagemUrl}" alt="${item.nome}">
                    <div class="effect-card-content">
                      <h4>${item.nome}</h4>
                      <p>${item.descricao}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
  }

});