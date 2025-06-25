#!/usr/bin/python3
# kate: replace-tabs true; tab-width 2;

# We've got the data per region in CSV files, let's transform them all into a
# large JSON file now

import os, csv, json
from glob import glob

CSV_SOURCE_DIR = "data/raw/os/"
JSON_OUTPUT = "data/os.json"

if __name__ == '__main__':
  data = {}
  for csv_filename in glob(os.path.join(CSV_SOURCE_DIR, "*.csv")):
    path = os.path.basename(csv_filename).split("_")
    region = path[0]
    platform = path[1]
    with open(csv_filename, 'r') as csv_file:
      for row in csv.DictReader(csv_file):
        year = row['Date']
        if not year in data.keys():
          data[year] = {}
        if not region in data[year].keys():
          data[year][region] = {}
        data[year][region][platform] = row

  with open(JSON_OUTPUT, 'w') as output:
    output.write(json.dumps(data, indent = 2))

  print("JSON file written to: {}".format(JSON_OUTPUT))