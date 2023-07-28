import { SyntheticEvent, useState } from 'react';
import { formatActiveCountry } from './methods';
import { EMPTY_COUNTRY, EMPTY_ERROR_OBJ, EMPTY_OPTIONS } from './types';
import './styles/App.scss';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(EMPTY_ERROR_OBJ);
  const [userInput, setUserInput] = useState('');
  const [activeCountry, setActiveCountry] = useState(EMPTY_COUNTRY);
  const [options, setOptions] = useState(EMPTY_OPTIONS);

  async function getCountryInfoByName(e: SyntheticEvent) {
    e.preventDefault();
    setActiveCountry(EMPTY_COUNTRY);
    setHasError(EMPTY_ERROR_OBJ);
    setIsLoading(true);
    setOptions(EMPTY_OPTIONS);

    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${userInput}`)
        .then(res => res.json());

      // Because the API returns an Object for bad requests:
      if (Array.isArray(response)) {
        if (response.length === 1) {
          const active = formatActiveCountry(response[0]);
          setActiveCountry(active);
        } else {
          const newOptions = response.map(countryObj => formatActiveCountry(countryObj));
          setOptions(newOptions);
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
          <h1>🔍 Results:</h1>
          <div className="divider" />
          {options.map(country => (
            <div className="countryOptionContainer" key={country.name} onClick={() => setActiveCountry(country)}>
              <p className="flag">{country.flag}</p>
              <p className="countryOptionName">{country.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
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

  function renderCountryInfoPanel() {
    return (
      <div className="countryContainer">
        <div className="content">
          <div className="countryNameContainer">
            <p>{activeCountry.flag}</p>
            <h1>{activeCountry.name}</h1>
          </div>
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
          Enter a country's name to view its info from the free <a href="https://restcountries.com/" target="_blank" rel="noreferrer">
             REST Countries API.
          </a>
        </p>
      </div>

      {isLoading && renderLoadingScreen()}
      {!isLoading
        && activeCountry.name === null
        && options[0].name === null
        && !hasError.wasSearchError
        && !hasError.wasServerError
        && renderHomeScreen()
      }
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
