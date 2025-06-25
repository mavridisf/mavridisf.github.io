/* ----------------------------------------------------------------------------
    Copyright © 2025 Philippe Mavridis <philippe.mavridis@yandex.com>
    Distributed under the terms of CC-BY-SA 4.0:
      https://creativecommons.org/licenses/by-sa/4.0/deed.en
---------------------------------------------------------------------------- */

const Year = {
  // Constants
  FIRST: 2009,
  LAST: 2023,

  // Current year
  current: null,

  // Year navigation
  prev: () => {
    if (Year.current > Year.FIRST)
    {
      --Year.current;
      Year.updateCombo();
      Year.updateAll();
    }
  },

  next: () => {
    if (Year.current < Year.LAST)
    {
      ++Year.current;
      Year.updateCombo();
      Year.updateAll();
    }
  },

  set: (year) => {
    Year.current = parseInt(year);
    Year.updateCombo();
    Year.updateMap();
  },

  // Year combobox event callback
  comboEvent: ({target}) => {
    Year.current = target.value;
    Year.updateAll();
  },

  // UI update functions
  updateCombo: () => {
    $('#mapComboYear')[0].value = Year.current;
  },
  updateMap: () => dispatchEvent(new Event("updateMap")),
  updateGraph: () => dispatchEvent(new Event("updateGraph")), //  Is it even a good idea?
  updateAll: () => {
    Year.updateMap();
    Year.updateGraph();
  },

  // AutoPlay
  _autoPlayStep: 0,
  _autoPlayInterval: null,
  autoPlay: () => {
    Year._autoPlayStep = 0;
    if (!Year._autoPlayInterval) {
      document.getElementById('mapAutoPlay').innerHTML = "cancel auto";
      Year._autoPlayInterval = setInterval(Year.autoPlayNext, 1000);
      Year.autoPlayNext();
    }
    else
    {
      document.getElementById('mapAutoPlay').innerHTML = "auto";
      clearInterval(Year._autoPlayInterval);
      Year._autoPlayInterval = null;
    }
  },
  autoPlayNext: () => {
    if (Year._autoPlayStep == 0) {
      Year.current = Year.FIRST;
    }
    else if (Year._autoPlayStep > (Year.LAST - Year.FIRST))
    {
      // toggle autoplay off
      return Year.autoPlay();
    }
    else
    {
      ++Year.current;
    }

    Year.updateCombo();
    Year.updateAll();

    ++Year._autoPlayStep;
  }
};

// kate: replace-tabs true; indent-width 2;