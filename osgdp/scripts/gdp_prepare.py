#!/usr/bin/python3
# kate: replace-tabs true; tab-width 2;

# Transform World Bank CSV dataset into a JSON we can work with

import os, csv, json, logging, country_converter

CSV_SOURCE = "data/raw/gdp_pcap.csv"
JSON_OUTPUT = "data/gdp_pcap.json"
YEAR_START = 2009
YEAR_END = 2023

if __name__ == '__main__':
  coco = country_converter.CountryConverter()
  logging.disable(logging.CRITICAL)

  data = {}
  start_row = 4
  with open(CSV_SOURCE, 'r') as csv_file:
    # Ignore header rows
    for i in range(start_row): next(csv_file)

    for row in csv.DictReader(csv_file):
      country = coco.convert(names = row['Country Name'], to = 'ISO2', not_found = "x")
      if country == 'x':
        print("Ignoring unrecognized/non-country entity:", row['Country Name'])
        continue

      for year in range(YEAR_START, YEAR_END + 1):
        year_key = str(year)
        if not year_key in data.keys():
          data[year_key] = {}

        if len(row[year_key]):
          data[year_key][country] = float(row[year_key])

  with open(JSON_OUTPUT, 'w') as output:
    output.write(json.dumps(data, indent = 2))

  print("JSON file written to: {}".format(JSON_OUTPUT))
