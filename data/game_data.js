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
    },
    imagemUrl: "https://wikily.gg/cdn-cgi/image/width=992,format=auto/https://r2.wikily.gg/images/once-human/icons/icon_v4_blueprint_ar_scar_sr1.webp"

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
    },
    imagemUrl: "https://wikily.gg/cdn-cgi/image/width=992,format=auto/https://r2.wikily.gg/images/once-human/icons/icon_v4_equip_blueprint_crossbow_ssr_02.webp"

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
    },
    imagemUrl: "https://wikily.gg/cdn-cgi/image/width=992,format=auto/https://r2.wikily.gg/images/once-human/icons/icon_v4_blueprint_smg_mp7_ssr_03.webp"
  }
];

const armaduras = [
  {
    id: 101,
    nome: "Gas-tight Helmet",
    tipo: "Capacete",
    raridade: "Lendária",
    nivel_requerido: 40,
    imagemUrl: "https://wikily.gg/cdn-cgi/image/width=256,format=auto/https://r2.wikily.gg/images/once-human/icons/icon_armor_m_cap34_256.webp",
    status_base: {
      durabilidade: 400,
      peso: 0.3
    },
    atributos_primarios: {
      vida_maxima: 590,
      resistencia_poluicao: 21,
      intensidade_psi: 92
    }
  },
  {
    id: 102,
    nome: "Lonewolf Mask",
    tipo: "Máscara",
    raridade: "Lendária",
    nivel_requerido: 40,
    imagemUrl: "https://wikily.gg/cdn-cgi/image/width=256,format=auto/https://r2.wikily.gg/images/once-human/icons/icon_armor_m_mask04_256.webp",
    status_base: {
      durabilidade: 400,
      peso: 0.3
    },
    atributos_primarios: {
      vida_maxima: 295,
      resistencia_poluicao: 28,
      intensidade_psi: 115
    }
  },
  {
    id: 103,
    nome: "Treacherous Tides Top",
    tipo: "Peitoral",
    raridade: "Lendária",
    nivel_requerido: 40,
    imagemUrl: "https://wikily.gg/cdn-cgi/image/width=256,format=auto/https://r2.wikily.gg/images/once-human/icons/icon_armor_m_coat29_v2_a_256.webp",
    status_base: {
      durabilidade: 400,
      peso: 0.2
    },
    atributos_primarios: {
      vida_maxima: 1534,
      resistencia_poluicao: 28,
      intensidade_psi: 64
    }
  }
];