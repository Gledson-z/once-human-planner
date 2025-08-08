document.addEventListener('DOMContentLoaded', () => {

  let slotAtivo = null;

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
          <h3>${item.nome} (${item.raridade})</h3>
          <p><strong>Tipo:</strong> ${item.tipo}</p>
          <hr>
          <h4>Status Base:</h4>
          <p><strong>Dano:</strong> ${item.status_base.dano}</p>
          <p><strong>Cadência:</strong> ${item.status_base.cadencia}</p>
          <p><strong>Carregador:</strong> ${item.status_base.carregador} balas</p>
          <hr>
          <h4>Atributos Primários:</h4>
          <p><strong>Taxa crítico:</strong> +${item.atributos_primarios.taxa_critico}%</p>
          <p><strong>Dano Crítico:</strong> +${item.atributos_primarios.dano_critico}%</p>
          <p><strong>Dano Ponto Fraco:</strong> +${item.atributos_primarios.dano_ponto_fraco}%</p>
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
    }
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
  // Adiciona um "espião" no campo de busca que dispara toda vez que você digita ou apaga algo.
  campoBusca.addEventListener('input', () => {
    // Pega o que foi digitado e converte pra minúsculas pra não diferenciar maiúscula de minúscula
    const termoBusca = campoBusca.value.toLowerCase();

    // Filtra a lista ORIGINAL de armas. Ele cria uma NOVA lista (armasFiltradas)
    // só com as armas cujo nome (em minúsculas) inclui o termo da busca.
    const armasFiltradas = armas.filter(arma => {
      return arma.nome.toLowerCase().includes(termoBusca);
    });

    // Manda a nova lista filtrada pra ser desenhada na tela
    renderizarItens(armasFiltradas, 'arma');
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
        campoBusca.style.display = 'block';
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
        <div class="slots-grid-arma"> <div class="slot-container" id="container-arma-primaria">
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
    let listaDeItens = []; // Uma lista vazia pra gente decidir o que colocar

    if (categoria === 'arma') {
      // Se for arma, a gente filtra a lista de ARMAS
      listaDeItens = armas.filter(item => item.tipo === tipoDeItem);
    } else if (categoria === 'armadura') {
      // Se for armadura, a gente filtra a lista de ARMADURAS
      listaDeItens = armaduras.filter(item => item.tipo === tipoDeItem);
    }

    const containerDoModal = document.getElementById('modal-lista-itens');

    // Agora a gente renderiza a lista que foi preenchida
    renderizarItens(listaDeItens, categoria, containerDoModal);

    const itensNoModal = modal.querySelectorAll('.item-selecionavel');

    itensNoModal.forEach(card => {
      card.addEventListener('click', () => {
        // Pega o ID que a gente guardou no 'data-id' do card
        const itemId = parseInt(card.dataset.id);
        if (!isNaN(itemId)) {
          // Chama a nossa função final!
          equiparItem(itemId, categoria);
        } else {
          console.error('ID do item inválido:', card.dataset.id);
        }
      });
    });

    // Abrir o modal
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
    }

    if (slotAtivo && itemParaEquipar) {
      slotAtivo.innerHTML = `
            <img src="${itemParaEquipar.imagemUrl}" alt="${itemParaEquipar.nome}">
            <p>${itemParaEquipar.nome}</p>
        `;
      slotAtivo.classList.add('equipado');
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
          abrirModalComItens('Fuzil de Assalto', 'arma');
        } else if (slotId === 'build-slot-arma-mod') {
          abrirModalComItens('Mod de Arma', 'arma');
        } else if (slotId === 'build-slot-arma-calibracao') {
          abrirModalComItens('Calibração', 'arma');
        }
      });
    });
  }

});