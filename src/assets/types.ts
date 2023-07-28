export type Country = {
  name: string,
  capital: string,
  continent: string,
  currency: string,
  flag: string,
  languages: string,
  population: string
};

export class ErrorObject {
  wasServerError: boolean;
  wasSearchError: boolean;
  failedSearchTerm: string | null;

  constructor(wasServer: boolean, wasSearch: boolean, term: string | null) {
    this.wasServerError = wasServer;
    this.wasSearchError = wasSearch;
    this.failedSearchTerm = term;
  }
};
