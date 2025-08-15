document.addEventListener('DOMContentLoaded', () => {

  let slotAtivo = null;
  let listaAtualNoModal = [];
  let categoriaAtualNoModal = null;

  // CAPTURAR OS ELEMENTOS IMPORTANTES DO HTML
  const appContainer = document.getElementById('app');
  const campoBusca = document.getElementById('campo-busca');
  const modal = document.getElementById('modal-selecao');
  const modalBtnFechar = document.getElementById('modal-btn-fechar');

  // FUNÇÃO PARA RENDERIZAR OS CARDS 
  function criarCardHTML(item, tipo) {

    if (tipo === 'arma') {
      return `
        <div class="card-arma item-selecionavel" data-id="${item.id}">
            <div class="card-imagem">
                <img src="${item.imagemUrl}" alt="Imagem da ${item.nome}">
            </div>
            <div class="card-conteudo">
                
                <h3>${item.nome} (${item.status_base.dano} DMG)</h3>
                
                <p class="info-tier">
                    <span>⭐ Tier ${item.tier}</span> | <span>${item.fabricante}</span>
                </p>
                
                <p class="info-efeito">${item.efeito_especial}</p> 
                
                <p><strong>Crit Rate:</strong> +${item.atributos_primarios.taxa_critico}%</p>
                <p><strong>Crit DMG:</strong> +${item.atributos_primarios.dano_critico}%</p>
                <p><strong>Weakspot DMG:</strong> +${item.atributos_primarios.dano_ponto_fraco}%</p>
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
          <h3>${item.nome} (${item.raridade})</h3>
          <p><strong>Tipo:</strong> ${item.tipo}</p>
          <hr>
          <h4>Atributos:</h4>
          <p><strong>HP:</strong> +${item.atributos_primarios.vida_maxima}</p>
          <p><strong>Resistência à Poluição:</strong> +${item.atributos_primarios.resistencia_poluicao}</p>
          <p><strong>Intensidade Psi:</strong> +${item.atributos_primarios.intensidade_psi}</p>
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
    }

  }

  function renderizarDetalhesArma(item) {
    const painel = document.getElementById('painel-detalhes-arma');

    if (!item) {
      painel.innerHTML = `<p class="placeholder-detalhes">Selecione uma arma para ver os detalhes...</p>`;
      return;
    }

    // 1. Busca o keyword correspondente na lista de keywords
    const keywordInfo = keywords.find(k => k.slug === item.keyword_slug);

    // 2. Monta a lista de efeitos da "Weapon Feature"
    const weaponFeatureHTML = item.weapon_feature.efeitos.map(efeito =>
      `<li>${efeito}</li>`
    ).join('');

    // 3. Monta o HTML completo do painel com todas as informações
    painel.innerHTML = `
        <div class="detalhes-header">
            <div>
                <h2>${item.nome} (${item.status_base.dano} DMG)</h2>
                <p>${item.fabricante}</p>
            </div>
        </div>
        
        <div class="detalhes-grid">
            <div>
                <p><strong>DMG:</strong> ${item.status_base.dano}</p>
                <p><strong>Reload:</strong> ${item.status_base.recarga}</p>
                <p><strong>Accuracy:</strong> ${item.status_base.precisao}</p>
            </div>
            <div>
                <p><strong>Fire Rate:</strong> ${item.status_base.cadencia}</p>
                <p><strong>Magazine:</strong> ${item.status_base.carregador}</p>
                <p><strong>Stability:</strong> ${item.status_base.estabilidade}</p>
            </div>
            <div>
                <h4>Equipment Stats</h4>
                <p><strong>Durability:</strong> ${item.durabilidade}</p>
                <p><strong>Weight:</strong> ${item.peso}</p>
                <p><strong>Required Level:</strong> ${item.nivel_requerido}</p>
            </div>
        </div>
        
        <hr>
        <h4>Weapon Feature: ${item.weapon_feature.titulo}</h4>
        <ul>${weaponFeatureHTML}</ul>
        
        ${keywordInfo ? `
            <hr>
            <h4>Keyword: ${keywordInfo.titulo}</h4>
            <p>${keywordInfo.descricao}</p>
        ` : ''}
    `;
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

    // Lógica para decidir onde procurar o item
    if (categoria === 'arma') {
      itemParaEquipar = armas.find(item => item.id === itemId);
    } else if (categoria === 'armadura') {
      itemParaEquipar = armaduras.find(item => item.id === itemId);
    } else if (categoria === 'calibracao') {
      itemParaEquipar = calibracoes.find(item => item.id === itemId);
    }

    if (slotAtivo && itemParaEquipar) {
      slotAtivo.innerHTML = `
            <img src="${itemParaEquipar.imagemUrl}" alt="${itemParaEquipar.nome}">
            <p>${itemParaEquipar.nome}</p>
        `;
      slotAtivo.classList.add('equipado');
    }
    if (categoria === 'arma') {
      renderizarDetalhesArma(itemParaEquipar);
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
          abrirModalComItens('Mod de Arma', 'arma');
        } else if (slotId === 'build-slot-arma-calibracao') {
          abrirModalComItens('Calibração', 'calibracao');
        }
      });
    });
  }

});