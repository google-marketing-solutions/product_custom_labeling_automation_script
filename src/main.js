// Copyright 2024, Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Shared Global Variable Spreadsheet
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

const FIELDS = {
  'segments.product_item_id': 'segments.product_item_id',
  'metrics.ctr': 'metrics.ctr',
  'metrics.clicks': 'metrics.clicks',
  'metrics.conversions': 'metrics.conversions',
  'metrics.average_cpc': 'metrics.average_cpc',
  'metrics.cost_micros': 'metrics.cost_micros'
}

function runShoppingReport() {
  let configValues = getInputParameters();
  updateStatus(STATUS.START);
  getShoppingReportData(configValues);
  updateStatus(STATUS.FINISH);
}

function getShoppingReportData(configValues) {
  let shoppingReport = processQuery(configValues.EXTERNAL_CID, configValues.START_DATE, configValues.END_DATE);
  writeReportToSheet(REPORT_HEADERS, shoppingReport, SHEET_NAMES.REPORTING_TAB);
}

/**
 * Entry point of the script.
 *
 */
function getAllChanges() {
  let configValues = getInputParameters();
  updateStatus(STATUS.START);
  getShoppingReportData(configValues);
  setProductsCustomLabel(configValues);
  updateStatus(STATUS.FINISH);
}

/** The checkCondition function checks if the control value meets the condition specified in the CONDITION variable. The condition can be one of the following:
 * Greater than or equal to: The control value must be greater than or equal to the threshold.
 * Less than or equal to: The control value must be less than or equal to the threshold.
 * Less than: The control value must be less than the threshold.
 * Greater than: The control value must be greater than the threshold.
 * Equal: The control value must be equal to the threshold.
 * Is between: The control value is between threshold1 and threashold2.
 * If the condition is not valid, the function throws an error.
 * 
 * @return {!object} custom object that contains the condition the be used in the IF statement on the setProductsCustomLabel_ function.
 * @private
 */
function checkCondition(condition, controlValue, threshold1, threshold2=0) {
 switch (condition) {
  case "Greater than": return controlValue > threshold1;
  case "Less than": return controlValue < threshold1;
  case "Greater than or equal to": return controlValue >= threshold1;
  case "Less than or equal to": return controlValue <= threshold1;
  case "Equal": return controlValue === threshold1;
  case "Is between": 
    if(threshold2 < threshold1) {
      customLog_(`Please use Threshold 1 as "lower bound" and  Threshold 2 as "upper bound". Provided condition ${condition} is not valid`);
      throw new Error(`Please use Threshold 1 as "lower bound" and  Threshold 2 as "upper bound". Provided condition ${condition} is not valid`);
    }
    if(threshold2 === threshold1) {
      customLog_(`Please use different threashold values. Provided threasholds ${threshold1} and ${threshold2} are equal`);
      throw new Error(`Please use different threashold values. Provided threasholds ${threshold1} and ${threshold2} are equal`);
    }
    return controlValue > threshold1 && controlValue < threshold2;
  default: 
    customLog_(`Please provide a valid condition. Provided condition ${condition} is not valid`);
    throw new Error(`Please provide a valid condition. Provided condition ${condition} is not valid`);
  }
}

/**
 * Thhrows error if the start date has been configured after the end date.
 * @param {!Object} startDate - The object containing the user configured start date.
 * @param {!Object} endDate - The object containing the user configured start date.
 *
 * @private
 */
function dateConfiguration_(startDate, endDate){
  if(!!startDate && !!endDate && startDate > endDate) {
    customLog_(`Please provide the start date (${startDate}) before the end date (${endDate}).`);
    throw new Error(`Please provide start date before the end date.`);
  }
}

/**
 * The function sets the custom label for products in the Product Feed Custom Labeling sheet iterating over the rows in the report sheet and checks if the control value meets the condition. 
 * If the condition is met, the function assigns the custom_label0.
 *
 * @private
 */
function setProductsCustomLabel(configValues) {
  updateStatus(STATUS.LABELING);
  let controlValue = configValues.CONTROL_VALUE;
  let condition = configValues.CONDITION;
  let customLabel = configValues.CUSTOM_LABEL;
  let threshold1 = configValues.THRESHOLD1;
  let threshold2 = configValues.THRESHOLD2;
  let reportSheet = spreadsheet.getSheetByName(SHEET_NAMES.REPORTING_TAB).getDataRange().getValues();
  let labeledProducts = [];

  for (let i = 1; i < reportSheet.length; i++) {
    let product = reportSheet[i];
    let productObj = {};
    product.forEach((item, index) => {productObj[REPORT_HEADERS[index]] = item});
    
    if(checkCondition(condition, productObj[controlValue], threshold1, threshold2)) {
      labeledProducts.push([productObj.productItemId, customLabel]);
    }
    else {
      labeledProducts.push([productObj.productItemId, ""]);
    }
  }
  writeLabeledProductsToSheet(PRODUCT_FEED_HEADERS, labeledProducts, SHEET_NAMES.OUTPUT_TAB);
}
