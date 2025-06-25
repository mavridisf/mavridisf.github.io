/* ----------------------------------------------------------------------------
    Copyright © 2025 Philippe Mavridis <philippe.mavridis@yandex.com>
    Distributed under the terms of CC-BY-SA 4.0:
      https://creativecommons.org/licenses/by-sa/4.0/deed.en
---------------------------------------------------------------------------- */

const dataset = async (dataset) => {
  let resp = await fetch(`data/${dataset}.json`);
  if (resp.status == 200) {
    return await resp.json();
  }
  else
  {
    console.log(resp.status, dataset);
  }
}

window.on("load", async () => {
  DATA = {
    OS: await dataset('os'),
    GDP: await dataset('gdp_pcap')
  };
  Year.current = Year.LAST;
  Platform.current = Platform.PLATFORMS[0];
  dispatchEvent(new Event("dataLoaded"));
});

// kate: replace-tabs true; indent-width 2;