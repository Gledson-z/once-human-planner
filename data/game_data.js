// A gente cria uma "constante" chamada "armas" que vai guardar uma lista (array) de objetos.
const armas = [
  {
    id: 1,
    nome: "SOCR-The Last Valor",
    tipo: "Fuzil de Assalto",
    raridade: "Lendária",
    tier: 5,
    nivel_requerido: 40,
    peso: 1.5,
    durabilidade: 100,
    status_base: {
      dano: 264,
      cadencia: 515,
      alcance: 75,
      carregador: 30,
      recarga: 56,
      mobilidade: 54,
      estabilidade: 39,
      precisao: 55
    },
    atributos_primarios: {
      taxa_critico: 6.0, // Guardamos como número pra facilitar os cálculos
      dano_critico: 27.0,
      dano_ponto_fraco: 60.0
    }
  }, {
    id: 2,
    nome: "Critical Pulse",
    tipo: "Besta",
    raridade: "Lendária",
    tier: 5,
    nivel_requerido: 40,
    peso: 1.5,
    durabilidade: 100,
    status_base: {
      dano: 1812,
      cadencia: 90,
      alcance: 64,
      carregador: 1,
      recarga: 75,
      mobilidade: 60,
      estabilidade: 57,
      precisao: 76
    },
    atributos_primarios: {
      taxa_critico: 2.0,
      dano_critico: 28.0,
      dano_ponto_fraco: 70.0
    }
  }, {
    id: 3,
    nome: "MPS7 - Outer Space",
    tipo: "SMG",
    raridade: "Lendária",
    tier: 5,
    nivel_requerido: 40,
    peso: 1.5,
    durabilidade: 100,
    status_base: {
      dano: 192,
      cadencia: 850,
      alcance: 45,
      carregador: 35,
      recarga: 32,
      mobilidade: 74,
      estabilidade: 43,
      precisao: 48
    },
    atributos_primarios: {
      taxa_critico: 8.0,
      dano_critico: 30.0,
      dano_ponto_fraco: 50.0
    }
  }
];