import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';  
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null); 

  
  useEffect(() => {
    axios.get('/countries.json')
      .then(response => setCountries(response.data))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  
  const filteredCountries = useMemo(() => {
    if (searchTerm.trim() === '') return [];

    return countries.filter(({ country, capital }) => 
      country.toLowerCase().includes(searchTerm.toLowerCase()) || 
      capital.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, countries]);

 
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setFilteredSuggestions(filteredCountries);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [filteredCountries]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  
  const handleCountryClick = (countryData) => {
    setSelectedCountry(countryData); 
    setSearchTerm(''); 
    setFilteredSuggestions([]); 
  };

  return (
    <div className="search-bar-container">
      <div className="input-wrapper">
        <FaSearch className="search-icon" />  {}
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
          placeholder="Search country or capital..."
        />
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="suggestions-container">
          <ul className="suggestions-list">
            {filteredSuggestions.map((countryData, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleCountryClick(countryData)} 
              >
                <span className="country-name">{countryData.country}</span>
                <span className="capital-name">({countryData.capital})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {}
      {selectedCountry && (
        <div className="selected-country-details">
          <h2>{selectedCountry.country}</h2>
          <p><strong>Capital:</strong> {selectedCountry.capital}</p>
          <p><strong>Region:</strong> {selectedCountry.region}</p>
          <p><strong>Population:</strong> {selectedCountry.population}</p>
          <p><strong>Area:</strong> {selectedCountry.area} km²</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
