# Product Custom Labeling Automation Script

## Table of Contents

1. [About](#about)
2. [Prerequisites](#prerequisites)
3. [Implementation Guide](#implementation-guide)
	1. [1. Copy Spreadsheet](#copy-spreadsheet)
	2. [2. Add  your Google Cloud Project Number](#add-your-google-cloud-project-number)
	3. [3. Schedule the daily execution of the Script](#schedule-the-daily-execution-of-the-script)
	4. [4. First Run](#first-run)
4. [Contributing](#contributing)
5. [License](#license)
6. [Disclaimer](#disclaimer)

## About

This script extracts products performances from a SA360 Shopping Campaign and sets a custom label to the products that meet a specific condition.
Once run, the same spreadsheet could be linked as a supplemental feed in Merchant Center to add/update the custom_label field in order to be used as a filter parameter inside the SA360 Templates.


## Prerequisites

* Access to the SA360 account to download reports from.
* A Google Cloud Platform project to enable following APIs:
	- Google Apps Script API
	- SA360 API

## Implementation Guide

The implementation of this solution is quite straightforward. You just have to follow these steps:

### 1. Copy Spreadsheet

Create a copy of the [following Google Spreadsheet](https://docs.google.com/spreadsheets/d/1MFuL4w1DDQ7G6qTxaiKlZ2JyFKvY_k3YJVHJrM2gssI/copy). 

It will automatically create a copy of the attached Apps Script with the functionality of the tool.
This Apps Script will handle the SA360 API calls and will update the Spreadsheet to monitor products SA360 metrics and the application of the custom_label0 parameter.


### 2. Add  your Google Cloud Project Number

Open the Apps Script to add your Google Cloud Project Number to the tool

![](https://github.com/google-marketing-solutions/product_custom_labeling_automation_script/blob/main/screenshots/screenshot1.png?raw=true)

Once you are in the Apps Script, go to the Settings tab and hit the Change Project button under the Google Cloud Platform (GCP) Project section

![](https://github.com/google-marketing-solutions/product_custom_labeling_automation_script/blob/main/screenshots/screenshot2.png?raw=true)

To find your Google Cloud Project Number, go to the Welcome Page of your GCP and find the information on the _Project info_ section

### 3. Schedule the daily execution of the Script

In your Apps Script, go to the Triggers section and add a new trigger, as follows:

![](https://github.com/google-marketing-solutions/product_custom_labeling_automation_script/blob/main/screenshots/screenshot3.png?raw=true)


### 4. First Run

Return to the Google Spreadsheet and reload the web page

The new **Product Custom Labeling Automation** menu should appear on the top Google Sheet menu bar

On the **Config** sheet, sets following parameters:

* External Customer ID
* Control Value
* Condition
* Threshold 1
* Threshold 2 _(optional - to be used only for "Is between" condition - otherwise leave it blank)_
* Your desired custom label
* Start Date _(optional start date filtering for retrieving report)_
* End Date _(optional end date filtering for retrieving report)_


Once everything's set, go on top Google Sheet menu bar, click on _Product Custom Labeling Automation_ -> _Get All Changes_


_NOTE: only on the first run, an authorization Google popup should appear. Once the authorization has been given, run **_Get All Changes_** again._

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.

## License

Apache 2.0; see [`LICENSE`](LICENSE) for details.

## Disclaimer

The script pulls performance campaign data from client's SA360 platform; it's equivalent to create a report directly on the SA360 UI. The data will rely on the spreadsheet and the user implementing this script will be responsible to share and/or distribute this data to any third parties.
Google is not responsible of any unauthorized disclosure or use of this data.
This project is not an official Google project. It is not supported by Google and Google specifically disclaims all warranties as to its quality, merchantability, or fitness for a particular purpose.


