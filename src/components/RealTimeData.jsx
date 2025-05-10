import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/TableComponent.css";

const RealTimeData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const [selectedTemperatureRange, setSelectedTemperatureRange] = useState(null); // 🔥 NEW

  const tempThresholds = {
    cold: 15,
    normal: 25,
    warm: 35,
    hot: 40
  };

  const getTemperatureColor = (temp) => {
    if (!temp || temp === "-") return {};
    const temperature = parseFloat(temp);
    if (isNaN(temperature)) return {};

    if (temperature < tempThresholds.cold) {
      return { backgroundColor: '#e3f2fd', color: '#1565c0' };
    } else if (temperature < tempThresholds.normal) {
      return { backgroundColor: '#f1f8e9', color: '#33691e' };
    } else if (temperature < tempThresholds.warm) {
      return { backgroundColor: '#fff3e0', color: '#e65100' };
    } else if (temperature < tempThresholds.hot) {
      return { backgroundColor: '#ffebee', color: '#c62828' };
    } else {
      return { backgroundColor: '#b71c1c', color: 'white' };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/aws_station_data");
        setData(response.data);
        setError(null);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching AWS data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = data.filter(item => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      (item.DISTRICT && item.DISTRICT.toLowerCase().includes(searchStr)) ||
      (item.STATION && item.STATION.toLowerCase().includes(searchStr)) ||
      (item.DATE && item.DATE.toLowerCase().includes(searchStr)) ||
      (item.TIME_IST && item.TIME_IST.toLowerCase().includes(searchStr));

    const temp = parseFloat(item.TEMP_C);
    const matchesTempRange = !selectedTemperatureRange ||
      (temp >= selectedTemperatureRange.min && temp < selectedTemperatureRange.max);

    return matchesSearch && matchesTempRange;
  });

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 🔥 Clickable Temperature Legend
  const TemperatureLegend = () => (
    <div className="temperature-legend">
      <h3>Temperature Indicators (Click to Filter):</h3>
      <div className="legend-items">
        <div className="legend-item" onClick={() => setSelectedTemperatureRange({ min: -Infinity, max: tempThresholds.cold })}>
          <span className="color-box cold"></span>
          <span>Below {tempThresholds.cold}°C (Cold)</span>
        </div>
        <div className="legend-item" onClick={() => setSelectedTemperatureRange({ min: tempThresholds.cold, max: tempThresholds.normal })}>
          <span className="color-box cool"></span>
          <span>{tempThresholds.cold}-{tempThresholds.normal}°C (Cool)</span>
        </div>
        <div className="legend-item" onClick={() => setSelectedTemperatureRange({ min: tempThresholds.normal, max: tempThresholds.warm })}>
          <span className="color-box warm"></span>
          <span>{tempThresholds.normal}-{tempThresholds.warm}°C (Warm)</span>
        </div>
        <div className="legend-item" onClick={() => setSelectedTemperatureRange({ min: tempThresholds.warm, max: tempThresholds.hot })}>
          <span className="color-box hot"></span>
          <span>{tempThresholds.warm}-{tempThresholds.hot}°C (Hot)</span>
        </div>
        <div className="legend-item" onClick={() => setSelectedTemperatureRange({ min: tempThresholds.hot, max: Infinity })}>
          <span className="color-box very-hot"></span>
          <span>Above {tempThresholds.hot}°C (Very Hot)</span>
        </div>
        <div className="legend-item" onClick={() => setSelectedTemperatureRange(null)}>
          <span className="color-box reset"></span>
          <span>Reset Filter</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="aws-data-container">
        <h2>
          STATE : <b>MAHARASHTRA</b>, DISTRICT : <b>PUNE</b>, STATION : <b>ALL_STATION</b>
          {lastUpdated && (
            <span style={{ fontSize: '0.9em', color: '#666' }}>
              {' '}(Last Updated: {lastUpdated})
              {loading && <span style={{ marginLeft: '10px', color: '#0066cc' }}>Refreshing...</span>}
            </span>
          )}
        </h2>

        <div className="data-summary">
          <p>
            Showing data for the last 48 hours
            <br />
            Total Records: <b>{sortedData.length}</b>
            {sortedData.length > 0 && (
              <>
                <br />
                Latest Record: <b>{sortedData[0]?.DATE} {sortedData[0]?.TIME_IST}</b>
              </>
            )}
          </p>
        </div>

        <TemperatureLegend />

        <div className="controls-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by District, Station, Date, or Time..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>
          <div className="page-size-container">
            <label>
              Rows per page:
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="page-size-select"
              >
                <option value={200}>200</option>
                <option value={400}>400</option>
                <option value={800}>800</option>
                <option value={1200}>1200</option>
              </select>
            </label>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please check your connection and try again.</p>
          </div>
        )}

        {!error && data.length === 0 && (
          <div className="no-data-message">
            <p>No data available at the moment.</p>
          </div>
        )}

        {data.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th onClick={() => sortData('DISTRICT')} style={{ cursor: 'pointer' }}>
                    District {sortConfig.key === 'DISTRICT' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('STATION')} style={{ cursor: 'pointer' }}>
                    Station {sortConfig.key === 'STATION' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('DATE')} style={{ cursor: 'pointer' }}>
                    Date {sortConfig.key === 'DATE' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => sortData('TIME_IST')} style={{ cursor: 'pointer' }}>
                    Time {sortConfig.key === 'TIME_IST' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th>Rainfall (mm)</th>
                  <th>Temp (°C)</th>
                  <th>Temp Min (°C)</th>
                  <th>Temp Max (°C)</th>
                  <th>RH (%)</th>
                  <th>RH Min-Max (%)</th>
                  <th>Wind Dir (°)</th>
                  <th>Wind Speed (Kt)</th>
                  <th>Wind Speed Max/Gust (Kt)</th>
                  <th>SLP (hPa)</th>
                  <th>MSLP (hPa/gpm)</th>
                  <th>Sunshine (HH.MM)</th>
                  <th>Battery (V)</th>
                  <th>GPS</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.DISTRICT || "-"}</td>
                    <td>{item.STATION || "-"}</td>
                    <td>{item.DATE || "-"}</td>
                    <td>{item.TIME_IST || "-"}</td>
                    <td>{item.RAIN_FALL || "-"}</td>
                    <td style={getTemperatureColor(item.TEMP_C)}>{item.TEMP_C || "-"}</td>
                    <td style={getTemperatureColor(item.TEMP_MIN_C)}>{item.TEMP_MIN_C || "-"}</td>
                    <td style={getTemperatureColor(item.TEMP_MAX_C)}>{item.TEMP_MAX_C || "-"}</td>
                    <td>{item.RH_PERCENT || "-"}</td>
                    <td>{item.RH_MIN_MAX_PERCENT || "-"}</td>
                    <td>{item.WIND_DIR_DEG || "-"}</td>
                    <td>{item.WIND_SPEED_KT || "-"}</td>
                    <td>{item.WIND_GUST_KT || "-"}</td>
                    <td>{item.SLP_HPA || "-"}</td>
                    <td>{item.MSLP_HPA || "-"}</td>
                    <td>{item.SUN_SHINE || "-"}</td>
                    <td>{item.BATTERY_VOLTS || "-"}</td>
                    <td>{item.GPS || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination-container">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First</button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RealTimeData;
