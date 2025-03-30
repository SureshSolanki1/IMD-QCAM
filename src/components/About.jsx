import React from "react";
import Header from "./Header";
import Footer from "./Footer";


const About = () => {
    return (
        <div className="History">
            <Header />
            <h1>HISTORY OF METEOROLOGICAL SERVICES IN INDIA</h1>
            <p>The beginnings of meteorology in India can be traced to ancient times. 
                Early philosophical writings of the 3000 B.C. era, such as the Upanishadas, 
                contain serious discussion about the processes of cloud formation and rain and the 
                seasonal cycles caused by the movement of earth round the sun. Varahamihira's classical 
                work, the Brihatsamhita, written around 500 A.D., provides a clear evidence that a deep
                knowledge of atmospheric processes existed even in those times. It was understood that
                rains come from the sun (Adityat Jayate Vrishti) and that good rainfall in the rainy 
                season was the key to bountiful agriculture and food for the people. Kautilya's 
                Arthashastra contains records of scientific measurements of rainfall and its application 
                to the country's revenue and relief work. Kalidasa in his epic, 'Meghdoot', written around
                the seventh century, even mentions the date of onset of the monsoon over central India
                and traces the path of the monsoon clouds.</p>
                <p>Meteorology, as we perceive it now, may be said to have had its firm scientific
                     foundation in the 17th century after the invention of the thermometer and the 
                     barometer and the formulation of laws governing the behaviour of atmospheric gases.
                      It was in 1636 that Halley, a British scientist, published his treatise on the 
                      Indian summer monsoon, which he attributed to a seasonal reversal of winds due to 
                      the differential heating of the Asian land mass and the Indian Ocean.</p>
                <p>India is fortunate to have some of the oldest meteorological observatories of the world.
                 The British East India Company established several such stations, for example, those at
                  Calcutta in 1785 and Madras (now Chennai) in 1796 for studying the weather and climate
                   of India. The Asiatic Society of Bengal founded in 1784 at Calcutta, and in 1804 at 
                   Bombay (now Mumbai), promoted scientific studies in meteorology in India. Captain 
                   Harry Piddington at Calcutta published 40 papers during 1835-1855 in the Journal of 
                   the Asiatic Society dealing with tropical storms and coined the word "cyclone", 
                   meaning the coil of a snake. In 1842 he published his monumental work on the "Laws of
                    the Storms". In the first half of the 19th century, several observatories began 
                    functioning in India under the provincial governments.</p>
                <p>A disastrous tropical cyclone struck Calcutta in 1864 and this was followed by failures 
                of the monsoon rains in 1866 and 1871. In the year 1875, the Government of India 
                established the India Meteorological Department, bringing all meteorological work in the
                 country under a central authority. Mr. H. F. Blanford was appointed Meteorological 
                 Reporter to the Government of India. The first Director General of Observatories was
                  Sir John Eliot who was appointed in May 1889 at Calcutta headquarters. The headquarters 
                  of IMD were later shifted to Shimla, then to Poona (now Pune) and finally to New Delhi.</p>
                  <h1>INDIA METEOROLOGICAL DEPARTMENT - MANDATE</h1>
                  <p><b>India Meteorological Department</b> was established in 1875. 
                  It is the National Meteorological Service of the country and the principal government 
                  agency in all matters relating to meteorology and allied subjects.</p>
                  <div>
        <ul className="custom-bullets">
        <li>To take meteorological observations and to provide current and forecast meteorological information for optimum operation of weather-sensitive activities like agriculture, irrigation, shipping, aviation, offshore oil explorations, etc.</li>
        <li>To warn against severe weather phenomena like tropical cyclones, norwesters, duststorms, heavy rains and snow, cold and heat waves, etc., which cause destruction of life and property.</li>
        <li>To provide meteorological statistics required for agriculture, water resource management, industries, oil exploration and other nation-building activities.</li>
        <li>To conduct and promote research in meteorology and allied disciplines.</li>
      </ul>
      <Footer/>
    </div>
        </div>
       
    );
};

export default About;