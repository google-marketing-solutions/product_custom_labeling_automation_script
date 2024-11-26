# Product Custom Labeling Automation Script

## Table of Contents

1. [About](#about)
2. [Prerequisites](#prerequisites)
3. [Setup](#setup)
	1. [Step 1: Environment setup](#step-1-environment-setup)
	2. [Step 2: Edit customizable variables and first run](#step-2-edit-customizable-variables-and-first-run)
4. [Contributing](#contributing)
5. [License](#license)
6. [Disclaimer](#disclaimer)

## About

This script extracts products performances from a SA360 Shopping Campaign and sets a custom label to the products that meet a specific condition.
Once run, the same spreadsheet could be linked as a supplemental feed in Merchant Center to add/update the custom_label field in order to be used as a filter parameter inside the SA360 Templates.


## Prerequisites

To use this script, you need the following:

* A SA360 account.
* A Google Cloud Platform project.
* The Google Apps Script API enabled.
* The SA360 API enabled.

## Setup

### Step 1: Environment setup

1. Create a new Google Spreadsheet.
2. Open the Apps Script editor from: _Extensions - Apps Script_.
3. On the Apps Script left panel, select _Project Settings_:
	* on the **General settings** panel, enable the _Show "appsscript.json" manifest file in editor_ option;
	* on the **Google Cloud Platform (GCP) Project** panel, edit the project number by using your own Google Cloud Platform project.
4. On the Apps Script left panel, select _Editor_ and open the _appsscript.json_ file; ensure you add the following _oauthScopes_ (inside square brackets and comma-separated):
	* "https://www.googleapis.com/auth/doubleclicksearch"
 	* "https://www.googleapis.com/auth/script.external_request"
 	* "https://www.googleapis.com/auth/adsense"
 	* "https://www.googleapis.com/auth/spreadsheets.currentonly"
 	* "https://www.googleapis.com/auth/script.scriptapp"

5. Copy the _main.js_ script code into the _main.gs_ file.
6. Click the _Add_ button and create a new _utils.gs_ file. 
7. Copy the _utils.js_ script code into the _utils.gs_ file.

### Step 2: Edit customizable variables and first run

1. In the Apps Script editor, select the _main.gs_ file.
2. On the _START CUSTOMIZABLE VARIABLES_ section set:
	* **CUSTOMER_ID** - your SA360 customer ID
	* **LOGIN_CUSTOMER_ID** - same as the _CUSTOMER ID_
	* **CONTROL_VALUE** - choose between "cost_micros", "clicks", "ctr", "conversions" or "average_cpc"
	* **THRESHOLD** - set any value you want to use as a threshold to compare your _CONTROL_VALUE_ with
	* **CONDITION** - choose between ">", "<", ">=", "<=" or "="
	* **CUSTOM_LABEL** - choose any label you want to use to showcase your products; this label should be also used as value filter on SA360 Template.
3. Return to the Google Spreadsheet and reload the web page
4. The new **SA360 Report Extraction** menu should appear:
	* click on _Extract products shopping campaign performances_

_NOTE: only on the first run, an authorization Google popup should appear. Once the authorization has been given, run **Extract products shopping campaign performances** again._

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.

## License

Apache 2.0; see [`LICENSE`](LICENSE) for details.

## Disclaimer

The script pulls performance campaign data from client's SA360 platform; it's equivalent to create a report directly on the SA360 UI. The data will rely on the spreadsheet and the user implementing this script will be responsible to share and/or distribute this data to any third parties.
Goggle is not responsible of any unauthorized disclosure or use of this data.
This project is not an official Google project. It is not supported by Google and Google specifically disclaims all warranties as to its quality, merchantability, or fitness for a particular purpose.
