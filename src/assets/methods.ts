import { Country, ErrorObject } from './types';

export function formatActiveCountry(rawResponse: any) {
  const newCountry: Country = {
    name: rawResponse.name.common,
    flag: rawResponse.flag,
    capital: rawResponse.capital?.[0] ?? 'n/a',
    continent: rawResponse.continents?.[0] ?? 'n/a',
    currency: rawResponse.currencies
      ? `The ${rawResponse.currencies[Object.keys(rawResponse.currencies)[0]].name}`
      : 'n/a',
    languages: rawResponse.languages
      ? formatLanguagesString(rawResponse.languages)
      : 'n/a',
    population: rawResponse.population ? formatPopulationString(rawResponse.population) : 'n/a',
  };

  return newCountry;
}

export function formatPopulationString(number: number): string {
  const numString: string = number.toString();
  const charCount: number = numString.length;
  let cutIndex, cutIndex2, cutIndex3;
  let outString: string = '';

  if (numString.length < 4) {
    outString = numString;
  } else if (charCount >= 4 && charCount < 7) {
    outString = [
      numString.slice(0, charCount - 3),
      numString.slice(charCount - 3, charCount),
    ].join(',');
  } else if (charCount >= 7 && charCount < 10) {
    if (charCount === 7) cutIndex = 1;
    else if (charCount === 8) cutIndex = 2;
    else if (charCount === 9) cutIndex = 3;
    outString = [
      numString.slice(0, cutIndex),
      ',',
      numString.slice(cutIndex, charCount - 3),
      ',',
      numString.slice(charCount - 3, charCount),
    ].join('');
  } else if (charCount >= 10) {
    if (charCount === 10) {
      cutIndex = 1;
      cutIndex2 = 4;
      cutIndex3 = 7;
    } else if (charCount === 11) {
      cutIndex = 2;
      cutIndex2 = 5;
      cutIndex3 = 8;
    }
    else if (charCount >= 12) {
      cutIndex = 3;
      cutIndex2 = 6;
      cutIndex3 = 9;
    }

    outString = [
      numString.slice(0, cutIndex),
      ',',
      numString.slice(cutIndex, cutIndex2),
      ',',
      numString.slice(cutIndex2, cutIndex3),
      ',',
      numString.slice(charCount - 3, charCount)
    ].join('');
  }

  return outString;
}

export function formatLanguagesString(languagesObj: any) {
  const objectKeys = Object.keys(languagesObj);
  let outString: string = languagesObj[objectKeys[0]];
  let numOfLanguages: number = objectKeys.length;
  
  if (numOfLanguages > 1) {
    for (let i = 1; i < numOfLanguages; i++) {
      outString += `, ${languagesObj[objectKeys[i]]}`;
    }
  }

  return outString;
}

export function generateSearchErrorObject(failedTerm: string) {
  return new ErrorObject(false, true, failedTerm);
}
export const NO_ERROR: ErrorObject = new ErrorObject(false, false, null);
export const SERVER_ERROR: ErrorObject = new ErrorObject(true, false, null);
