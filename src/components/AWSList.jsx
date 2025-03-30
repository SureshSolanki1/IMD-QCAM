import React from "react";
import "../styles/TableComponent.css"; // Make sure the path is correct

const TableComponent = () => {
  const tableData = [
    {
      srNo: 1,
      state: "MAHARASHTRA",
      district: "PUNE",
      station: "NIMGIRI_JUNNAR",
      latitude: 19.2092,
      longitude: 73.8725,
      altitude: 619.0,
    },
    {
      srNo: 2,
      state: "MAHARASHTRA",
      district: "PUNE",
      station: "CAGMO_SHIVAJINAGAR",
      latitude: 18.5386,
      longitude: 73.842,
      altitude: 559.0,
    },
    {
      srNo: 3,
      state: "MAHARASHTRA",
      district: "PUNE",
      station: "CHRIST_UNIVERSITY_LAVASA",
      latitude: 18.4144,
      longitude: 73.5069,
      altitude: 687.3,    
    },
    {
        srNo: 4,
        state: "MAHARASHTRA",
        district: "PUNE",
        station: "DPS_HADAPSAR_PUNE",
        latitude: 18.4659,
        longitude: 73.9244,
        altitude: 618.7,    
      },
      {
        srNo: 5,
        state: "MAHARASHTRA",
        district: "PUNE",
        station: "INS_SHIVAJI_LONAVALA",
        latitude: 18.724,
        longitude: 73.3697,
        altitude: 620.8,    
      },
      {
        srNo: 6,
        state: "MAHARASHTRA",
        district: "PUNE",
        station: "KHUTBAV_DAUND",
        latitude: 18.5056,
        longitude: 74.3304,
        altitude: 554.0,    
      },
      {
        srNo: 7,
        state: "MAHARASHTRA",
        district: "PUNE",
        station: "LONIKALBHOR_HAVELI",
        latitude: 18.4697,
        longitude: 74.0013,
        altitude: 563.0,    
      },
      {
        srNo: 8,
        state: "MAHARASHTRA",
        district: "PUNE",
        station: "NARAYANGAON_KRISHI_KENDRA",
        latitude: 19.1003,
        longitude: 73.9655,
        altitude: 694.5,    
      },
      {
        srNo: 9,
        state: "MAHARASHTRA",
        district: "PUNE",
        station: "NIASM_BARAMATI",
        latitude: 18.153,
        longitude: 74.5003,
        altitude: 569.7,    
      },
      {
        srNo: 10,
        state: "MAHARASHTRA",
        district: "PUNE",
        station: "PASHAN_AWS_LAB",
        latitude: 18.5167,
        longitude: 73.85,
        altitude: 577.0,    
      },
      {
        srNo: 11,
        state: "MAHARASHTRA",
        district: "PUNE",
        station: "RAJGURUNAGAR",
        latitude: 18.841,
        longitude: 73.884,
        altitude: 598.1,    
      },
      {
        srNo: 12,
        state: "MAHARASHTRA",
        district: "PUNE",
        station: "TALEGAON",
        latitude: 18.722,
        longitude: 73.6632,
        altitude: 635.8,    
      }
    
    // Add more rows as needed (up to 12 or more)
    ];

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>State</th>
            <th>District</th>
            <th>Station</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Altitude</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.srNo}>
              <td>{row.srNo}</td>
              <td>{row.state}</td>
              <td>{row.district}</td>
              <td>{row.station}</td>
              <td>{row.latitude}</td>
              <td>{row.longitude}</td>
              <td>{row.altitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
