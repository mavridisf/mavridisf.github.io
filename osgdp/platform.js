/* ----------------------------------------------------------------------------
    Copyright © 2025 Philippe Mavridis <philippe.mavridis@yandex.com>
    Distributed under the terms of CC-BY-SA 4.0:
      https://creativecommons.org/licenses/by-sa/4.0/deed.en
---------------------------------------------------------------------------- */

const Platform = {
  PLATFORMS: ["desktop", "mobile"],
  current: null,

  set: (platform) => {
    if (Platform.PLATFORMS.includes(platform))
    {
        Platform.current = platform;
        Platform.updateMap();
        Platform.updateGraph();
    }
  },

  comboEvent: ({target}) => {
    Platform.set(target.value);
  },

  updateMap: () => {
    dispatchEvent(new Event("updateMap"));
  },
  updateGraph: () => {
    dispatchEvent(new Event("updateGraph"));
  }
};