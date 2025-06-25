#!/usr/bin/python3
# kate: replace-tabs true; tab-width 2;

import os, requests, urllib
from io import BytesIO
from tqdm import tqdm
from fake_useragent import UserAgent
from bs4 import BeautifulSoup

YEAR_START = 2009
YEAR_END = 2023
USER_AGENT = UserAgent().ff
DOWNLOAD_PATH = "data/raw/os/"

PLATFORMS = {
    "desktop": {
      'device': 'Desktop',
      'device_hidden': 'desktop',
      'statType_hidden': 'os_combined',
      'granularity': 'yearly',
      'statType': 'Operating System',
      'fromInt': YEAR_START,
      'toInt': YEAR_END,
      'fromYear': YEAR_START,
      'toYear': YEAR_END,
      'csv': 1
    },
    "mobile": {
      'device': 'Mobile & Tablet',
      'device_hidden': 'mobile+tablet',
      'multi-device': 'true',
      'statType_hidden': 'os_combined',
      'granularity': 'yearly',
      'statType': 'Operating System',
      'fromInt': YEAR_START,
      'toInt': YEAR_END,
      'fromYear': YEAR_START,
      'toYear': YEAR_END,
      'csv': 1
    }
}

'''
Convenience wrapper for requests.get which uses the generated user agent and
displays a progress bar.
'''
def get(url, desc = "Downloading data"):
  global USER_AGENT
  r = requests.get(url, headers = {'User-Agent': USER_AGENT}, stream = True)
  total = int(r.headers.get('Content-Length', 0))
  response = BytesIO()
  bar = tqdm(desc = desc, total = total, unit = 'iB', unit_scale = True, unit_divisor = 1024)
  for data in r.iter_content(chunk_size = 1024):
    response.write(data)
    bar.update(len(data))
  return response.getvalue().decode("utf-8")

'''
The Region class contains data about a single region and related methods.
'''
class Region:
  def __init__(self, region_code, region_name):
    self.code = region_code
    self.name = region_name

  '''
  Returns a list of all regions for which data is available
  '''
  @staticmethod
  def get_list():
    global USER_AGENT
    html = get("http://gs.statcounter.com/os-market-share/",
               "Downloading region list")
    soup = BeautifulSoup(html, features = "lxml")
    data = []
    for x in soup.find(id = "region").find_all("option"):
      data.append(Region(x['value'], x.text))
    return data

  '''
  Returns the URL address of the CSV dataset for the current region.
  The dataset contains yearly OS popularity data spanning from YEAR_START to
  YEAR_END (defined as globals).
  '''
  def get_download_url(self, platform):
    global YEAR_START, YEAR_END, PLATFORMS
    url = "https://gs.statcounter.com/os-market-share/chart.php?"
    params = PLATFORMS[platform]
    params['region_hidden'] = self.code
    params['region'] = self.name
    return "{}{}".format(url, urllib.parse.urlencode(params))

  '''
  Generates a filename for the downloaded CSV dataset for the current region
  and returns it as a path according to the global DOWNLOAD_PATH.
  '''
  def get_download_path(self, platform):
    global DOWNLOAD_PATH, YEAR_START, YEAR_END
    filename = "{rc}_{p}_{ys}_{ye}.csv".format(ys = YEAR_START, ye = YEAR_END,
                                               rc = self.code, p = platform)
    return os.path.join(DOWNLOAD_PATH, filename)

  def __str__(self):
    return "{rc} ({rn})".format(rc = self.code, rn = self.name)

  def __repr__(self):
    return str(self)


# -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
if __name__ == '__main__':
  print("Current user-agent: {}".format(USER_AGENT))

  regions = Region.get_list()
  print("Year range: {ys}-{ye}".format(ys = YEAR_START, ye = YEAR_END))

  print("Downloading OS usage data for {} regions...".format(len(regions)))

  os.makedirs(DOWNLOAD_PATH, exist_ok = True)

  i = 1
  for region in regions:
    for platform in PLATFORMS.keys():
      download_url = region.get_download_url(platform)
      download_path = region.get_download_path(platform)

      data = get(download_url, "Downloading {rc}-{p} [{i}/{l}]".format(
        rc = region.code,
        p = platform,
        i = i,
        l = len(regions)
      ))

      with open(download_path, "w") as output:
        output.write(data)
        print("...saved:", download_path)

      i += 1

# kate: replace-tabs true; indent-width 2;