import React, { useState, useEffect } from 'react';
import Custom_Map from './Custom_Map';
import AWSList from './AWSList';
import Header from './Header';
import Footer from './Footer';
import '../styles/AWS_Network.css';

const AWS_Network = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Store multiple results

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Please enter a search term");
      return;
    }
  
    try {
      console.log("🛠 Fetching:", `http://localhost:5000/api/stations/search?query=${searchQuery}`);
  
      const response = await fetch(`http://localhost:5000/api/stations/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      console.log("📌 Search Response:", data);
  
      if (data.length > 0) {
        setSearchResults(data); // Store multiple matching stations
      } else {
        alert("No station found with that name");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("❌ Error searching station:", error);
      alert("Error searching station. Please try again.");
    }
  };
  
  return (
    <div className="aws-network">
      <Header />
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AWS station by Name..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="station-details">
          <h2>Station Details</h2>
          <table className="station-table">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Station Name</th>
                <th>Sensor ID</th>
                <th>Sensor Name</th>
                <th>Installation Date</th>
                <th>Last Maintenance</th>
                <th>Next Maintenance</th>
                <th>Status</th>
                <th>Outlier Fetched</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((station, index) => (
                <tr key={station._id}>
                  <td>{index + 1}</td>
                  <td>{station.name}</td>
                  <td>{station.sensorID}</td>
                  <td>{station.sensorName}</td>
                  <td>{new Date(station.installationDate).toLocaleDateString()}</td>
                  <td>{new Date(station.lastMaintenance).toLocaleDateString()}</td>
                  <td>{new Date(station.nextMaintenance).toLocaleDateString()}</td>
                  <td className={station.needsMaintenance ? 'status-offline' : 'status-online'}>
                    {station.needsMaintenance ? 'Offline' : 'Online'}
                  </td>
                  <td>{station.outlierFetched ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AWSList />
      <Custom_Map />
      <Footer />
    </div>
  );
};

export default AWS_Network;
