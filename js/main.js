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
      appContainer.innerHTML = tipo === 'arma' ? '<p>Nenhuma arma encontrada com esse nome...</p>' : '<p>Nenhuma armadura cadastrada...</p>';
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
  // Quando a página carrega pela primeira vez, chama a função pra mostrar TODAS as armas.
  renderizarItens(armas, 'arma');

  // LÓGICA DE NAVEGAÇÃO DAS ABAS
  const abas = document.querySelectorAll('.menu-categorias .aba');

  abas.forEach(aba => {
    aba.addEventListener('click', (event) => {
      event.preventDefault();
      abas.forEach(a => a.classList.remove('ativa'));
      aba.classList.add('ativa');

      const categoriaSelecionada = aba.textContent;

      if (categoriaSelecionada === 'Arma Primária') {
        campoBusca.style.display = 'block';
        renderizarItens(armas, 'arma');
      } else if (categoriaSelecionada === 'Armadura') {
        campoBusca.style.display = 'none';
        const layoutDosSlots = criarLayoutSlotsArmadura();
        appContainer.innerHTML = layoutDosSlots;
        const todosOsSlots = document.querySelectorAll('.slot');
        todosOsSlots.forEach(slot => {
          slot.addEventListener('click', (event) => {
            slotAtivo = event.currentTarget;
            const tipoDoSlot = slot.id.replace('build-slot-', '');
            const tipoDoItem = tipoDoSlot.charAt(0).toUpperCase() + tipoDoSlot.slice(1);
            abrirModalComItens(tipoDoItem);
          });
        });
      } else {
        campoBusca.style.display = 'none';
        appContainer.innerHTML = `<h2>🔧 Conteúdo para "${categoriaSelecionada}" em construção! 🔧</h2>`;
      }
    });
  });

  function criarLayoutSlotsArmadura() {
    return `
        <div class="slots-grid">
            <div class="slot-container">
                <h4>Capacete</h4>
                <div class="slot" id="build-slot-capacete">
                    <p>Vazio</p>
                </div>
            </div>
            <div class="slot-container">
                <h4>Máscara</h4>
                <div class="slot" id="build-slot-mascara">
                    <p>Vazio</p>
                </div>
            </div>
            <div class="slot-container">
                <h4>Peitoral</h4>
                <div class="slot" id="build-slot-peitoral">
                    <p>Vazio</p>
                </div>
            </div>
            <div class="slot-container">
                <h4>Luvas</h4>
                <div class="slot" id="build-slot-luvas">
                    <p>Vazio</p>
                </div>
                </div>
            <div class="slot-container">
                <h4>Calças</h4>
                <div class="slot" id="build-slot-calcas">
                    <p>Vazio</p>
                    </div>
                    </div>
            <div class="slot-container">
                <h4>Botas</h4>
                <div class="slot" id="build-slot-botas">
                    <p>Vazio</p>
                    </div>
            </div>
    `;
  }
  // LÓGICA DO MODAL
  function abrirModal() {
    modal.style.display = 'flex';
  }
  modalBtnFechar.addEventListener('click', fecharModal);

  function fecharModal() {
    modal.style.display = 'none';
  }
  modalBtnFechar.addEventListener('click', fecharModal);

  function abrirModalComItens(tipoDeItem) {
    // Filtrar a lista de armaduras pra pegar só o tipo que a gente quer
    const itensParaMostrar = armaduras.filter(item => item.tipo === tipoDeItem);

    // Usar a função renderizarItens pra desenhar os cards dentro do modal
    const containerDoModal = document.getElementById('modal-lista-itens');
    renderizarItens(itensParaMostrar, 'armadura', containerDoModal); // <-- Um upgrade na nossa função!
    // Captura todos os cards que acabaram de ser criados DENTRO do modal
    const itensNoModal = modal.querySelectorAll('.item-selecionavel');
    // Adiciona um "espião" de clique em cada um deles
    itensNoModal.forEach(card => {
      card.addEventListener('click', () => {
        // Pega o ID que a gente guardou no 'data-id' do card
        const itemId = parseInt(card.dataset.id);
        // Chama a nossa função final!
        equiparItem(itemId);
      });
    });
    // Abrir o modal
    abrirModal();

  }

  function equiparItem(itemId) {
    // A gente usa o .find() pra achar o objeto completo da armadura pelo id
    const itemParaEquipar = armaduras.find(item => item.id === itemId);

    // Se a gente achou um slot ativo e um item correspondente...
    if (slotAtivo && itemParaEquipar) {

      // Atualiza o conteúdo do slot com a imagem e o nome do item!
      slotAtivo.innerHTML = `
            <img src="${itemParaEquipar.imagemUrl}" alt="${itemParaEquipar.nome}">
            <p>${itemParaEquipar.nome}</p>
        `;

      // Adiciona uma classe pra gente poder estilizar o slot preenchido depois
      slotAtivo.classList.add('equipado');
    }

    fecharModal(); // Fecha o modal
  }

});