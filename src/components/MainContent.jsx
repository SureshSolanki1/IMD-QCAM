import React from 'react';
import "../styles/global.css";

const MainContent = () => {
  return (
    <main className="main-content">
      <section className="content-section">
        <h2>AWS - QUALITY CONTROL AND MAINTENANCE</h2>
        <br></br>
        <p>The <b>AWS Quality Control and Maintenance</b> project for the India Meteorological Department (IMD) is focused on ensuring the accuracy, reliability, and efficiency of <b>Automatic Weather Stations (AWS)</b> deployed across Maharashtra. These stations collect real-time meteorological data essential for weather forecasting, climate monitoring, and disaster management.This project plays a crucial role in enhancing the precision and reliability of automated weather monitoring, ensuring that IMD continues to provide accurate forecasts and climate insights.</p>
        <br></br>
        <p>This project, under the sponsorship of the <b>India Meteorological Department (IMD)</b>, aims at developing and utilizing strong quality control and maintenance systems to ensure
higher correctness, reliability, and longevity of meteorological instruments and data acquisition processes. With the fast growing demand for precise weather data across sectors like
agriculture, aviation, and disaster management, the reliability of meteorological measurements has become indispensable. The
project has two primary objectives, Quality Control Framework
Development and Preventive and Predictive Maintenance. The
project will introduce condition-based monitoring systems to
detect faults early in sensors and calibration equipment, thus
maximizing equipment life and efficient use of maintenance
resources. These efforts will aim to establish new standards
for reliability of data within IMD’s operations, which in turn
will advance the organization’s mission of generating timely and
accurate weather forecasts. The expected impacts are a major
reduction in malfunctions of equipment, enhanced data quality
for public consumption, and the development of a replicable
quality control and maintenance procedure that is adoptable by
other meteorological organizations.</p>
<p>The <b>India Meteorological Department (IMD)</b> is instrumental in predicting weather and supplying critical data for
various industries like agriculture, aviation, disaster management, and public safety. The quality and reliability of weather
information have direct implications on decision-making in
these sectors. But the quality of meteorological information
depends to a large extent on the accuracy and condition
of equipment used for collecting data and the strength of
quality control processes that govern this information. Thus,
effective quality control and maintenance systems must be
established to provide data integrity and operational reliability. This project is undertaken to meet these requirements
by creating an integrated quality control and maintenance
framework that improves the performance and reliability of
meteorological instruments and data collection. The project
will target establishing standardized quality control protocols
for detecting anomalies in data and using predictive maintenance methods to minimize replacement of equipment and
the lifespan of meteorological sensors and instruments. Over
the past few years, technological developments, particularly
in fields like machine learning and IoT (Internet of Things),
provide promising pathways to proactive monitoring and pre-
dictive analytics. Utilizing these technologies, the project seeks
to create a data-driven, predictive maintenance model which
will allow the IMD to meet problems before affecting data
quality or equipment operations. This project will assist in
the IMD mission of offering reliable, timely, and accurate
weather information, culminating in a larger India desire for
sustainability and climate variability resilience. Its successful
implementation will yield:</p>
<ul>
  <li><i>Improved data accuracy and consistency</i></li>
  <li><i>Fewer equipment breakdowns and downtime</i></li>
  <li><i>A replicable quality control and maintenance framework that can be applied throughout IMD’s network of weather stations.</i></li>
</ul>
        <div className="image-content">
        <img src="AWS.png" alt="AWS Tower" />
        </div>
        {/* Dynamic IMD Pune Temperature Map */}
 <div className="image-content2">
  <h3>LIVE TEMPERATURE MAP [PUNE]</h3>
  <img
    src="https://www.imdpune.gov.in/cmpg/homepage/temp.gif"
    alt="IMD Pune Temperature Map"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "/fallback.png"; // Optional fallback image
    }}/>
</div>
<br></br>
<div className="image-content2">
  <h3>LIVE RAINFALL MAP [PUNE]</h3>
  <img
    src="https://www.imdpune.gov.in/cmpg/homepage/combined.gif"
    alt="IMD Pune Rainfall Map"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "/fallback.png"; // Optional fallback image
    }}/>
</div>
        <div className="info-cards">
          <div className="info-card">
            <div className="card-icon">📊</div>
            <h3>Data Collection</h3>
            <p>Real-time meteorological data acquisition from stations across Pune</p>
          </div>
          
          <div className="info-card">
            <div className="card-icon">🔍</div>
            <h3>Quality Control</h3>
            <p>Detecting outliers/anomalies in real time data for Quality Control</p>
          </div>
          
          <div className="info-card">
            <div className="card-icon">🛠️</div>
            <h3>Maintenance</h3>
            <p>Regular scheduling of maintenance to ensure optimal performance</p>
          </div>
        </div>      
      </section>
    </main>
  );
};

export default MainContent;