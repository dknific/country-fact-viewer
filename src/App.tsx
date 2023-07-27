import { useState } from 'react';
import './styles/App.scss';

const INITIAL_COUNTRY = {
  name: '',
  capital: '',
  continent: '',
  currency: '',
  languages: '',
};

const INITIAL_ERROR_OBJ = {
  wasServerError: false,
  wasSearchError: false,
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(INITIAL_ERROR_OBJ);
  const [userInput, setUserInput] = useState('');
  const [activeCountry, setActiveCountry] = useState(INITIAL_COUNTRY);

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
    return {
      name: rawResponse.name.common,
      capital: rawResponse.capital[0],
      continent: rawResponse.continents[0],
      currency: rawResponse.currencies[Object.keys(rawResponse.currencies)[0]].name,
      languages: formatLanguagesString(rawResponse.languages)
    };
  }

  async function getCountryInfoByName(e: any) {
    e.preventDefault();
    console.log(e.target.value)
    setActiveCountry(INITIAL_COUNTRY);
    setHasError(INITIAL_ERROR_OBJ);
    setIsLoading(true);

    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${userInput}`)
        .then(res => res.json());

      // Because the API returns an Object for bad requests:
      if (Array.isArray(response)) {
        const country = formatActiveCountry(response[0])
        setActiveCountry(country);
      } else {
        setHasError({ wasServerError: false, wasSearchError: true });
      }
    } catch (error) {
      setHasError({ wasServerError: true, wasSearchError: false });
    }
    
    setIsLoading(false);
  }

  function handleKeyUp(event: any) {
    setUserInput(event.target.value);
  }

  return (
    <div className="App">
      <div className="searchBarContainer">
        <form className="searchBar" onSubmit={e => getCountryInfoByName(e)}>
          <input type="text" placeholder="Type a country name..." onKeyUp={(e) => handleKeyUp(e)}/>
          <input type="submit" value="Go" />
        </form>

        <p>Search for a country using the free and public Countries API.</p>
      </div>

      {!isLoading && activeCountry.name !== '' && (
        <div className="countryContainer">
          <div className="content">
            <h1>{activeCountry.name}</h1>
            <div className="divider" />
            <p><b>Capital City:</b> {activeCountry.capital}</p>
            <p><b>Continent:</b> {activeCountry.continent}</p>
            <p><b>Languages:</b> {activeCountry.languages}</p>
            <p><b>Currency:</b> {activeCountry.currency}</p>
          </div>
        </div>
      )}

      {!isLoading && (hasError.wasSearchError || hasError.wasServerError) && (
        <div className="errorContainer">
          <div className="content">
          <h2>Whoops!</h2>
          <div className="divider" />
          {hasError.wasSearchError && (
            <>
              <p>Your query didn't return any results.</p>
              <p>Try again with a different query, or try spelling it differently.</p>
            </>
          )}
          {hasError.wasServerError && (
            <>
              <p>There appears to be an error with the server.</p>
              <p>Please try again later.</p>
            </>
          )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
