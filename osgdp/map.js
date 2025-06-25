/* ----------------------------------------------------------------------------
    Copyright © 2025 Philippe Mavridis <philippe.mavridis@yandex.com>
    Distributed under the terms of CC-BY-SA 4.0:
      https://creativecommons.org/licenses/by-sa/4.0/deed.en
---------------------------------------------------------------------------- */

const UNKNOWN = "Άγνωστο";

window.on("dataLoaded", async () => {
  // --- Initialize map -------------------------------------------------------
  let osm = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const MAP_DATA = {
    MAP: L.map('map').setView([0, 0], 2),
    LAYER: L.tileLayer(osm, {attribution: '© OSM contributors'}),
    LEGEND: L.control({position: 'bottomright'}),
    YEAR_CHOOSER: L.control({position: 'topright'}),
    PLATFORM_CHOOSER: L.control({position: 'bottomleft'}),
    GEOJSON: await dataset('geojson'),
    MARKERS: []
  };

  // --- Initialize utility functions -----------------------------------------
  const getIndexedColor = idx => {
    return [
      "#e9e9e9",
      "#f33b30",
      "#e37c1c",
      "#cda838",
      "#baca6f",
      "#b3e5ac",
      "#98d694",
      "#7cc87e",
      "#5db968",
      "#37aa53"
    ][idx];
  }

  const getCountryColor = iso2 => {
    let gdp = DATA.GDP[Year.current][iso2];
    return gdp >= 100000 ? getIndexedColor(9) :
           gdp >= 50000  ? getIndexedColor(8) :
           gdp >= 30000  ? getIndexedColor(7) :
           gdp >= 20000  ? getIndexedColor(6) :
           gdp >= 10000  ? getIndexedColor(5) :
           gdp >= 5000   ? getIndexedColor(4) :
           gdp >= 2000   ? getIndexedColor(3) :
           gdp >= 1000   ? getIndexedColor(2) :
           gdp >  0      ? getIndexedColor(1) :
                           getIndexedColor(0) ;  // no data
  }

  const getMostPopularOS = iso2 => {
    if (DATA.OS[Year.current][iso2] === undefined) return null;
    let data = DATA.OS[Year.current][iso2][Platform.current],
        max = 0,
        os = null;

    for (let it in data) {
        if (it == "Date") continue;
        let perc = parseFloat(data[it]);
        if (perc > max) {
            max = perc;
            os = it;
        }
    }

    return os;
  }

  const getOSMarkerIcon = iso2 => {
    let zoom = MAP_DATA.MAP.getZoom(),
        osIcon = getMostPopularOS(iso2)?.toLowerCase()
                                        .replace(' ', '_')
                                        .replace('other', 'unknown')
                 ?? "unknown";

    return L.icon({
      iconUrl: `assets/map/${osIcon}.png`,
      iconSize: [zoom * 5, zoom * 5]
    });
  }

  const countryTooltip = layer => {
    const country = {
      name: layer.country ?? layer.feature.properties['name'],
      iso2: layer.iso2 ?? layer.feature.properties['ISO3166-1-Alpha-2']
    };

    const data = {
      gdp: DATA.GDP[Year.current][country.iso2],
      os: DATA.OS[Year.current][country.iso2][Platform.current]
    };

    let tbody = $$("tbody");

    const gdp = data.gdp ? "$" + data.gdp.toLocaleString() : UNKNOWN;
    let caption = $$("caption",
                     `<big>${country.name}</big><br>(GDP Per Capita: ${gdp})`,
                     {style: "font-weight: bold"});

    // Sort operating systems by popularity
    let sorted = [];
    for (let os in data.os) {
      if (os == "Date") continue;
      sorted.push([os, data.os[os]]);
    }
    sorted.sort((a, b) => b[1] - a[1]);
    let i = 0;
    sorted.forEach(entry => {
      if (entry[1] == 0) return;
      ++i;
      let row = $$("tr", i > 1 ? {} : {style: "background: #ffeaea;"});
      row.append(
        $$("td", i),
        $$("td", entry[0]),
        $$("td", entry[1].toLocaleString() + '%')
      );
      tbody.append(row);
    });

    let table = $$("table", {style: "width: 100%"});
    table.append(caption);
    table.append(tbody);

    return table.outerHTML;
  }

  // --- Map features ---------------------------------------------------------
  var GEOJSON = null;
  window.on("updateMap", () => {
    if (GEOJSON) {
      GEOJSON.remove();
      delete GEOJSON;
    }

    if (MAP_DATA.MARKERS.length) {
      MAP_DATA.MARKERS.forEach(marker => {
        marker.remove();
        delete marker;
      });
      MAP_DATA.MARKERS = [];
    }

    // --- Initialize countries -----------------------------------------------
    GEOJSON = L.geoJson(MAP_DATA.GEOJSON, {

      // --- Country style ----------------------------------------------------
      style: feature => {
        return {
          fillColor: getCountryColor(feature['properties']['ISO3166-1-Alpha-2']),
          weight: 1,
          opacity: .66,
          color: '#000000',
          fillOpacity: .66
        }
      },

      onEachFeature: (feature, layer) => {
        layer.on({
          add: event => {
            // --- Add OS markers ---------------------------------------------
            let iso2 = feature.properties['ISO3166-1-Alpha-2'],
                country = feature.properties['name'];

            let marker = L.marker(layer.getCenter(), {
              title: country,
              icon: getOSMarkerIcon(iso2)
            });

            MAP_DATA.MARKERS.push(marker);
            marker.iso2 = iso2;
            marker.country = country;
            marker.bindPopup(countryTooltip);
            marker.addTo(MAP_DATA.MAP);
          },

          // --- Country highlight on hover -----------------------------------
          mouseover: event => {
            const layer = event.target;
            layer.setStyle({
              opacity: .75,
              fillOpacity: .75
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          },

          mouseout: event => {
            GEOJSON.resetStyle(event.target);
          },

          // --- Country center on click --------------------------------------
          click: event => {
            MAP_DATA.MAP.fitBounds(event.target.getBounds(), {padding: [50, 50]});
          }
        })
      }
    });

    // --- Country popups -----------------------------------------------------
    GEOJSON.bindPopup(countryTooltip);
    GEOJSON.addTo(MAP_DATA.MAP);
  });

  // --- Add GDP per capita legend box ----------------------------------------
  MAP_DATA.LEGEND.onAdd = map => {
    let div = L.DomUtil.create('div', 'widget legend'),
        grades = [0, 1000, 2000, 5000, 10000, 20000, 30000, 50000, 100000],
        labels = [];

    let contents = "<b>GDP Per Capita</b><br>";
    for (let i = 0; i < grades.length; ++i) {
      contents += '<i style="background: ' + getIndexedColor(i + 1) + '"></i>'
                + '$' + grades[i]
                + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    div.innerHTML = contents;
    return div;
  }

  // --- Add year chooser widget ----------------------------------------------
  MAP_DATA.YEAR_CHOOSER.onAdd = map => {
    let div = L.DomUtil.create('div', 'widget chooser');
    div.append(
      // Back button
      $$('button', "<", {
        title: "Προηγούμενο έτος",
        onclick: Year.prev
      }),

      // Year combobox
      $$('select', {
        id: 'mapComboYear',
        title: "Αλλαγή έτους",
        value: Year.current,
        onchange: Year.comboEvent
      }),

      // Forward button
      $$('button', ">", {
        title: "Επόμενο έτος",
        onclick: Year.next
      }),

      $$("br"),

      // AutoPlay button
      $$('button', "auto", {
        id: 'mapAutoPlay',
        title: "Αυτόματη αναπαραγωγή",
        onclick: Year.autoPlay,
        style: "width: 100%"
      }),
    );

    for (let y = Year.FIRST; y <= Year.LAST; ++y) {
      div.find('#mapComboYear').append($$('option', y, { value: y }));
    }

    return div;
  }

  // --- Add platform chooser widget ------------------------------------------
  MAP_DATA.PLATFORM_CHOOSER.onAdd = map => {
    let div = L.DomUtil.create('div', 'widget chooser');
    div.append(
      $$("select", {
        id: 'mapComboPlatform',
        title: "Αλλαγή πλατφόρμας",
        value: Platform.current,
        onchange: Platform.comboEvent
      })
    );
    div.find("#mapComboPlatform").append(
      $$("option", "Η/Υ", {value: "desktop"}),
      $$("option", "Κινητά & Ταμπλέτες", {value: "mobile"})
    );
    return div;
  }

  // --- Scale OS markers according to zoom level -----------------------------
  MAP_DATA.MAP.on('zoomend', () => {
    MAP_DATA.MARKERS.forEach(marker => marker.setIcon(getOSMarkerIcon(marker.iso2)));
  })

  MAP_DATA.LAYER.addTo(MAP_DATA.MAP);
  MAP_DATA.LEGEND.addTo(MAP_DATA.MAP);
  MAP_DATA.YEAR_CHOOSER.addTo(MAP_DATA.MAP);
  MAP_DATA.PLATFORM_CHOOSER.addTo(MAP_DATA.MAP);
  Year.updateCombo();
  dispatchEvent(new Event("updateMap"));
});

// kate: replace-tabs true; indent-width 2;