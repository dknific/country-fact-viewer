import { SyntheticEvent, useState } from 'react';
import { formatActiveCountry, generateSearchErrorObject, NO_ERROR, SERVER_ERROR } from './assets/methods';
import { Country, ErrorObject } from './assets/types';
import './styles/App.scss';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<ErrorObject>(NO_ERROR);
  const [userInput, setUserInput] = useState('');
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);

  const showCountryInfoScreen = !isLoading && activeCountry;
  const showErrorScreen =
    !isLoading && (hasError.wasSearchError || hasError.wasServerError);
  const showHomeScreen =
    !isLoading && !activeCountry && options.length === 0 && hasError === NO_ERROR;
  const showCountrySelectScreen =
    !isLoading && !activeCountry && options.length > 1;

  async function getCountryInfoByName(e: SyntheticEvent) {
    e.preventDefault();
    setActiveCountry(null);
    setHasError(NO_ERROR);
    setIsLoading(true);
    setOptions([]);

    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${userInput}`)
        .then(res => res.json());

      // Because the API returns an Object for bad requests:
      if (Array.isArray(response)) {
        if (response.length === 1) {
          const active: Country = formatActiveCountry(response[0]);
          setActiveCountry(active);
        } else {
          const newOptions: Country[] = response.map(countryObj => formatActiveCountry(countryObj));
          setOptions(newOptions);
        }
      } else {
        const searchErrorObject: ErrorObject = generateSearchErrorObject(userInput);
        setHasError(searchErrorObject);
      }
    } catch (error) {
      console.warn(error);
      setHasError(SERVER_ERROR);
    }
    
    setIsLoading(false);
  }

  function handleKeyUp(e: SyntheticEvent<HTMLInputElement>) {
    setUserInput(e.currentTarget.value);
  }

  function renderLoadingScreen() {
    return (
      <div className="loadingScreenContainer">
        <div className="content">
          <p>Loading results,</p>
          <p>please wait...</p>
          <span className="loader"></span>
        </div>
      </div>
    );
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

  function renderCountrySelectScreen(countryResults: Array<Country>) {
    return (
      <div className="countrySelectContainer">
        <div className="content">
          <h1>🔍 Results:</h1>
          <div className="divider" />
          {countryResults.length && countryResults.map(country => (
            <div
              className="countryOptionContainer"
              key={country.name}
              onClick={() => setActiveCountry(country)}
            >
              <p className="flag">{country.flag}</p>
              <p className="countryOptionName">{country.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderCountryInfoScreen(country: Country) {
    return (
      <div className="countryContainer">
        <div className="content">
          <div className="countryNameContainer">
            <p>{country.flag}</p>
            <h1>{country.name}</h1>
          </div>
          <div className="divider" />
          <p><b>Population:</b> {country.population} people</p>
          <p><b>Capital City:</b> {country.capital}</p>
          <p><b>Currency:</b> {country.currency}</p>
          <p><b>Continent:</b> {country.continent}</p>
          <p><b>Languages:</b> {country.languages}</p>
        </div>
      </div>
    );
  }

  function renderHomeScreen() {
    return (
      <div className="homeScreenContainer">
        <div className="content">
          <h1>Search for a country to get started!</h1>
          <p>🌎</p>
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

        <p>
          Enter a country's name to view its info from the free{" "}
          <a href="https://restcountries.com/" target="_blank" rel="noreferrer">
            REST Countries API.
          </a>
        </p>
      </div>

      {isLoading && renderLoadingScreen()}
      {showErrorScreen && renderErrorScreen()}
      {showHomeScreen && renderHomeScreen()}
      {showCountrySelectScreen && renderCountrySelectScreen(options)}
      {showCountryInfoScreen && renderCountryInfoScreen(activeCountry)}
    </div>
  );
}

export default App;
