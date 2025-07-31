// Capturar o container
const containerDeArmas = document.getElementById('lista-de-armas');

// Limpar o container antes de adicionar coisas novas (boa prática!)
containerDeArmas.innerHTML = '';

// Loop em cada arma
for (const arma of armas) {

  // Cria o card com os CAMINHOS para os dados
  const cardDaArma = `
    <div class="card-arma">
      <h2>${arma.nome} (${arma.raridade})</h2>
      <p><strong>Tipo:</strong> ${arma.tipo}</p>
      <p><strong>Dano:</strong> ${arma.status_base.dano}</p>
      <p><strong>Cadência:</strong> ${arma.status_base.cadencia}</p>
      <p><strong>Carregador:</strong> ${arma.status_base.carregador} balas</p>
      <hr>
      <p><strong>Dano Crítico:</strong> +${arma.atributos_primarios.dano_critico}%</p>
      <p><strong>Taxa Crítica:</strong> ${arma.atributos_primarios.taxa_critico}%</p>
      <p><strong>Dano Ponto Fraco:</strong> +${arma.atributos_primarios.dano_ponto_fraco}%</p>
    </div>
  `;

  // Inserir o card no container
  containerDeArmas.innerHTML += cardDaArma;
}