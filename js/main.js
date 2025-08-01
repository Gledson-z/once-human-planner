// CAPTURAR OS ELEMENTOS IMPORTANTES DO HTML
// O container principal onde os cards vão aparecer
const appContainer = document.getElementById('app');
// O novo campo de busca que a gente acabou de criar
const campoBusca = document.getElementById('campo-busca');

// FUNÇÃO PARA RENDERIZAR OS CARDS 

function renderizarArmas(listaDeArmas) {
  appContainer.innerHTML = '';

  if (listaDeArmas.length === 0) {
    appContainer.innerHTML = '<p>Nenhuma arma encontrada com esse nome...</p>';
    return;
  }

  let htmlParaRenderizar = '';
  listaDeArmas.forEach(arma => {
    // Estrutura com div para imagem e div para conteúdo.
    const cardDaArma = `
      <div class="card-arma">
        <div class="card-imagem">
          <img src="${arma.imagemUrl}" alt="Imagem da ${arma.nome}">
        </div>
        <div class="card-conteudo">
          <h3>${arma.nome} (${arma.raridade})</h3>
          <p><strong>Tipo:</strong> ${arma.tipo}</p>
          <hr>
          <h4>Status Base:</h4>
          <p><strong>Dano:</strong> ${arma.status_base.dano}</p>
          <p><strong>Cadência:</strong> ${arma.status_base.cadencia}</p>
          <p><strong>Carregador:</strong> ${arma.status_base.carregador} balas</p>
          <hr>
          <h4>Atributos Primários:</h4>
          <p><strong>Taxa crítico:</strong> +${arma.atributos_primarios.taxa_critico}%</p>
          <p><strong>Dano Crítico:</strong> +${arma.atributos_primarios.dano_critico}%</p>
          <p><strong>Dano Ponto Fraco:</strong> +${arma.atributos_primarios.dano_ponto_fraco}%</p>
        </div>
      </div>
    `;
    htmlParaRenderizar += cardDaArma;
  });

  appContainer.innerHTML = htmlParaRenderizar;
}

function renderizarArmaduras(listaDeArmaduras) {
  appContainer.innerHTML = ''; // Limpa a tela

  if (listaDeArmaduras.length === 0) {
    appContainer.innerHTML = '<p>Nenhuma armadura cadastrada...</p>';
    return;
  }

  let htmlParaRenderizar = '';
  listaDeArmaduras.forEach(armadura => {
    const cardDaArmadura = `
      <div class="card-arma">
        <div class="card-imagem">
          <img src="${armadura.imagemUrl}" alt="Imagem da ${armadura.nome}">
        </div>
        <div class="card-conteudo">
          <h3>${armadura.nome} (${armadura.raridade})</h3>
          <p><strong>Tipo:</strong> ${armadura.tipo}</p>
          <hr>
          <h4>Atributos:</h4>
          <p><strong>HP:</strong> +${armadura.atributos_primarios.vida_maxima}</p>
          <p><strong>Resistência à Poluição:</strong> +${armadura.atributos_primarios.resistencia_poluicao}</p>
          <p><strong>Intensidade Psi:</strong> +${armadura.atributos_primarios.intensidade_psi}</p>
        </div>
      </div>
    `;
    htmlParaRenderizar += cardDaArmadura;
  });

  appContainer.innerHTML = htmlParaRenderizar;
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
  renderizarArmas(armasFiltradas);
});


// RENDERIZAÇÃO INICIAL
// Quando a página carrega pela primeira vez, chama a função pra mostrar TODAS as armas.
renderizarArmas(armas);

// 5. LÓGICA DE NAVEGAÇÃO DAS ABAS
const abas = document.querySelectorAll('.menu-categorias .aba');

abas.forEach(aba => {
  aba.addEventListener('click', (event) => {
    event.preventDefault();
    abas.forEach(a => a.classList.remove('ativa'));
    aba.classList.add('ativa');

    const categoriaSelecionada = aba.textContent;

    if (categoriaSelecionada === 'Arma Primária') {
      campoBusca.style.display = 'block';
      renderizarArmas(armas);
    } else if (categoriaSelecionada === 'Armadura') {
      campoBusca.style.display = 'none';
      renderizarArmaduras(armaduras);
    } else {
      campoBusca.style.display = 'none';
      appContainer.innerHTML = `<h2>🔧 Conteúdo para "${categoriaSelecionada}" em construção! 🔧</h2>`;
    }
  });
});