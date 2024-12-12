export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Placa {
  fields: Values[];
}

interface Values {
  imgUrl: string;
  name: string;
  key: string;
  qtd: number;
}
