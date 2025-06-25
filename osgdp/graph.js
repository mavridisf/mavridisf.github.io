/* ----------------------------------------------------------------------------
    Copyright © 2025 Philippe Mavridis <philippe.mavridis@yandex.com>
    Distributed under the terms of CC-BY-SA 4.0:
      https://creativecommons.org/licenses/by-sa/4.0/deed.en
---------------------------------------------------------------------------- */

var GRAPH_PALETTE = [];

const resetPalette = () => {
  GRAPH_PALETTE = [
    "#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b",
    "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"
  ];
}

const assignPaletteColor = os => {
  if (os == "Unknown") return "#CCCCCC";

  if (!GRAPH_PALETTE.length) {
    resetPalette();
  }

  return GRAPH_PALETTE.pop() ?? "#444444";
}

window.on("dataLoaded", () => {
  var getCountryNames = new Intl.DisplayNames(['el'], {type: 'region'});

  let countries = [];
  for (let iso2 in DATA.OS[Year.current]) {
    let gdp = DATA.GDP[Year.current][iso2];
    if (gdp !== undefined) {
      countries.push({iso2: iso2, gdp: gdp});
    }
  }
  countries.sort((a, b) => b.gdp - a.gdp);

  let TRACES = {};
  Platform.PLATFORMS.forEach(platform => {
    TRACES[platform] = {};
    resetPalette();
    countries.forEach(({iso2, gdp}) => {
      for (let os in DATA.OS[Year.current][iso2][platform]) {
        if (os == 'Date' || DATA.OS[Year.current][iso2][platform][os] < .5) {
          continue;
        }
        if (!os.length || os == "Other" || os == "Unknown") {
          os = "Άγνωστο";
        }
        let pop = parseFloat(DATA.OS[Year.current][iso2][platform][os]);

        if (TRACES[platform][os] === undefined) {
          TRACES[platform][os] = {
            type: 'scatter',
            mode: 'markers',
            name: os,
            marker: {
              color: assignPaletteColor(os),
              symbol: 'circle',
              size: 16
            },
            y: [],
            x: [],
            text: [],
            visible: platform == Platform.PLATFORMS[0]
          };
        }

        TRACES[platform][os]['x'].push(gdp);
        TRACES[platform][os]['y'].push(pop);
        TRACES[platform][os]['text'].push(getCountryNames.of(iso2));
      }
    });
  });

  let traces = [];
  let states = [];
  for (let platform in TRACES) {
    for (let trace in TRACES[platform])
    {
      traces.push(TRACES[platform][trace]);
      states.push(platform);
    }
  }

  Plotly.newPlot('graph', traces, {
    title: {
      text: "Δημοφιλία ΛΣ και κατά κεφαλήν ΑΕΠ"
    },
    xaxis: {
      title: "Κατά κεφαλήν ΑΕΠ",
      showline: true
    },
    yaxis: {
      title: "Δημοφιλία ΛΣ"
    },
    updatemenus: [
      {
        y: .9,
        yanchor: 'top',
        buttons: [
          {
            method: 'restyle',
            args: ['mode', 'markers'],
            label: "Σημεία"
          },
          {
            method: 'restyle',
            args: ['mode', 'lines'],
            label: "Γραμμές"
          },
          {
            method: 'restyle',
            args: ['mode', 'markers+lines'],
            label: "Και τα δυο"
          }
        ]
      },
      {
        y: 1,
        yanchor: 'top',
        buttons: [
          {
            method: 'restyle',
            args: ['visible', states.map(platform => platform == "desktop")],
            label: "Η/Υ"
          },
          {
            method: 'restyle',
            args: ['visible', states.map(platform => platform == "mobile")],
            label: "Κινητό & Ταμπλέτα"
          }
        ]
      }
    ]
  });
});

// kate: replace-tabs true; indent-width 2;