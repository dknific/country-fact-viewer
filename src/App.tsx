import { SyntheticEvent, useState } from 'react';
import './styles/App.scss';

interface Country {
  name: string | null,
  capital: string | null,
  continent: string | null,
  currency: string | null,
  flag: string | null,
  languages: string | null,
  population: string | null
};

interface ErrorObj {
  wasServerError: boolean,
  wasSearchError: boolean,
  failedSearchTerm: string
};

const INITIAL_COUNTRY: Country = {
  name: null,
  capital: null,
  continent: null,
  currency: null,
  flag: null,
  languages: null,
  population: null
};

const INITIAL_ERROR_OBJ: ErrorObj = {
  wasServerError: false,
  wasSearchError: false,
  failedSearchTerm: ''
};

const OPTIONS = [INITIAL_COUNTRY, INITIAL_COUNTRY];

function formatPopulationString(number: number): string {
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

function formatLanguagesString(languagesObj: any) {
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

function formatActiveCountry(rawResponse: any) {
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

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(INITIAL_ERROR_OBJ);
  const [userInput, setUserInput] = useState('');
  const [activeCountry, setActiveCountry] = useState(INITIAL_COUNTRY);
  const [options, setOptions] = useState(OPTIONS);

  async function getCountryInfoByName(e: SyntheticEvent) {
    e.preventDefault();
    setActiveCountry(INITIAL_COUNTRY);
    setHasError(INITIAL_ERROR_OBJ);
    setIsLoading(true);
    setOptions(OPTIONS);

    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${userInput}`)
        .then(res => res.json());

      // Because the API returns an Object for bad requests:
      if (Array.isArray(response)) {
        if (response.length === 1) {
          const active = formatActiveCountry(response[0]);
          setActiveCountry(active);
        } else {
          const options = response.map(countryObj => formatActiveCountry(countryObj));
          setOptions(options);
        }
      } else {
        setHasError({ wasServerError: false, wasSearchError: true, failedSearchTerm: userInput });
      }
    } catch (error) {
      console.warn(error);
      setHasError({ wasServerError: true, wasSearchError: false, failedSearchTerm: '' });
    }
    
    setIsLoading(false);
  }

  function handleKeyUp(e: SyntheticEvent<HTMLInputElement>) {
    setUserInput(e.currentTarget.value);
  }

  function renderErrorScreen() {
    return (
      <div className="errorContainer">
        <div className="content">
        <h2>Whoops!</h2>
        <div className="divider" />
        {hasError.wasSearchError && (
          <>
            <p>The term '<b><i>{hasError.failedSearchTerm}</i></b>' didn't return any results.</p>
            <p>Try again with a different query, or try spelling it differently.</p>
          </>
        )}
        {hasError.wasServerError && (
          <>
            <p>There appears to be an error with the server.</p>
            <p>Please wait a few moments and try again.</p>
          </>
        )}
        </div>
      </div>
    );
  }

  function renderCountrySelect() {
    return (
      <div className="countrySelectContainer">
        <div className="content">
          <h1>Results:</h1>
          <div className="divider" />
          {options.map(country => (
            <div className="countryOptionContainer" onClick={() => setActiveCountry(country)}>
              <p className="flag">{country.flag}</p>
              <p className="countryOptionName">{country.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderCountryInfoPanel() {
    return (
      <div className="countryContainer">
        <div className="content">
          <h1>{activeCountry.flag} {activeCountry.name}</h1>
          <div className="divider" />
          <p><b>Population:</b> {activeCountry.population} people</p>
          <p><b>Capital City:</b> {activeCountry.capital}</p>
          <p><b>Currency:</b> {activeCountry.currency}</p>
          <p><b>Continent:</b> {activeCountry.continent}</p>
          <p><b>Languages:</b> {activeCountry.languages}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="searchBarContainer">
        <form className="searchBar" onSubmit={e => getCountryInfoByName(e)}>
          <input
            type="text"
            placeholder="Type a country name..."
            onKeyUp={(e) => handleKeyUp(e)}
          />
          <input type="submit" value="Go" />
        </form>

        <p>Enter a country's name to view its info from the free Countries API.</p>
      </div>

      {!isLoading && activeCountry.name === null && options[0].name !== null && renderCountrySelect()}
      {!isLoading && activeCountry.name !== null && renderCountryInfoPanel()}
      {!isLoading
        && (hasError.wasSearchError || hasError.wasServerError)
        && renderErrorScreen()
      }

    </div>
  );
}

export default App;
