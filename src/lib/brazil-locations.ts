export const BRAZILIAN_STATES = [
  { uf: 'AC', name: 'Acre' },
  { uf: 'AL', name: 'Alagoas' },
  { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' },
  { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' },
  { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' },
] as const;

export type BrazilianStateCode = (typeof BRAZILIAN_STATES)[number]['uf'];

export const BRAZILIAN_CITIES_BY_UF: Partial<Record<BrazilianStateCode, string[]>> = {
  PR: ['Cascavel', 'Toledo', 'Maringá', 'Londrina', 'Curitiba', 'Pato Branco', 'Guarapuava', 'Foz do Iguaçu'],
  SP: ['São Paulo', 'Ribeirão Preto', 'Campinas', 'São José do Rio Preto', 'Presidente Prudente'],
  MT: ['Cuiabá', 'Rondonópolis', 'Sorriso', 'Sinop', 'Lucas do Rio Verde'],
  MS: ['Campo Grande', 'Dourados', 'Maracaju', 'Ponta Porã'],
  GO: ['Goiânia', 'Rio Verde', 'Jataí', 'Cristalina'],
  RS: ['Porto Alegre', 'Passo Fundo', 'Cruz Alta', 'Santa Maria'],
  SC: ['Florianópolis', 'Chapecó', 'Joinville', 'Criciúma'],
  MG: ['Belo Horizonte', 'Uberaba', 'Uberlândia', 'Patos de Minas'],
  BA: ['Luís Eduardo Magalhães', 'Barreiras', 'Salvador'],
  MA: ['Balsas', 'Imperatriz', 'São Luís'],
  PI: ['Uruçuí', 'Bom Jesus', 'Teresina'],
  TO: ['Palmas', 'Gurupi', 'Araguaína'],
};

export function getCitiesByState(uf?: string | null) {
  if (!uf) {
    return [];
  }

  return BRAZILIAN_CITIES_BY_UF[uf.toUpperCase() as BrazilianStateCode] ?? [];
}

export function isBrazilianStateCode(value?: string | null): value is BrazilianStateCode {
  if (!value) {
    return false;
  }

  return BRAZILIAN_STATES.some((state) => state.uf === value.toUpperCase());
}
