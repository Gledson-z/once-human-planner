// Passo 1: Capturar nosso "outdoor" pelo ID que demos a ele.
const containerDeArmas = document.getElementById('lista-de-armas');


// Passo 2: Fazer um loop, ou seja, passar por CADA item da nossa lista "armas".
// (mesmo que por enquanto só tenha um item, isso já prepara pro futuro)
for (const arma of armas) {

  // Passo 3: Para cada arma, vamos criar um bloco de HTML em formato de texto.
  // Usamos a crase (`) para conseguir colocar as variáveis (${...}) dentro do texto.
  const cardDaArma = `
    <div class="card-arma">
      <h2>${arma.nome}</h2>
      <p><strong>Tipo:</strong> ${arma.tipo}</p>
      <p><strong>Munição:</strong> ${arma.municao}</p>
      <p><strong>Dano Base:</strong> ${arma.dano_base}</p>
      <p><strong>Raridade:</strong> ${arma.raridade}</p>
    </div>
  `;

  // Passo 4: Inserir o bloco de HTML que a gente acabou de criar DENTRO do nosso "outdoor".
  containerDeArmas.innerHTML += cardDaArma;
}