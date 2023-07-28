export type Country = {
  name: string | null,
  capital: string | null,
  continent: string | null,
  currency: string | null,
  flag: string | null,
  languages: string | null,
  population: string | null
};

type ErrorObj = {
  wasServerError: boolean,
  wasSearchError: boolean,
  failedSearchTerm: string
};

export const EMPTY_COUNTRY: Country = {
  name: null,
  capital: null,
  continent: null,
  currency: null,
  flag: null,
  languages: null,
  population: null
};

export const EMPTY_ERROR_OBJ: ErrorObj = {
  wasServerError: false,
  wasSearchError: false,
  failedSearchTerm: ''
};

export const EMPTY_OPTIONS: Array<Country> = [EMPTY_COUNTRY];
