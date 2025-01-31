const BATCH_SIZE = 100;

const SHEET_NAMES = {
  INPUT_TAB: 'Config',
  REPORTING_TAB: 'SA360 Shopping Report',
  OUTPUT_TAB: 'Product Feed Custom Labeling'
}

const RANGE_NAMES = {
  STATUS: 'StatusRange',
};

const REPORT_HEADERS = [
  'productItemId',
  'cost_micros',
  'clicks',
  'ctr',
  'conversions',
  'average_cpc'
];

const PRODUCT_FEED_HEADERS = [
  'productItemId',
  'custom_label0'
];

const STATUS = {
  START: 'Started',
  IN_PROGRESS: 'Extracting shopping performance data from SA360',
  LABELING: 'Setting up Custom Labels',
  FINISH: 'Last executed'
}

/**
 * This function creats the Product Custom Labeling Automation service menu on Google Spreadsheet UI.
 * 
 * @public
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Product Custom Labeling Automation')
      .addItem('SA360 Report Extraction', 'runShoppingReport')
      .addItem('Get All Changes', 'getAllChanges')
      .addToUi();
}

/**
 * This function gets input parameters.
 * 
 * @return {!object} input parameters.
 * @public
 */
function getInputParameters() {
  let ss = spreadsheet.getSheetByName(SHEET_NAMES.INPUT_TAB);
  let configValues = {
      EXTERNAL_CID: ss.getRange(`${SHEET_NAMES.INPUT_TAB}!B1`).getValue().toString().replaceAll('-', ''),
      CONTROL_VALUE: ss.getRange(`${SHEET_NAMES.INPUT_TAB}!B2`).getValue(),
      CONDITION: ss.getRange(`${SHEET_NAMES.INPUT_TAB}!B3`).getValue(),
      THRESHOLD1: ss.getRange(`${SHEET_NAMES.INPUT_TAB}!B4`).getValue(),
      THRESHOLD2: ss.getRange(`${SHEET_NAMES.INPUT_TAB}!B5`).getValue(),
      CUSTOM_LABEL: ss.getRange(`${SHEET_NAMES.INPUT_TAB}!B7`).getValue()
  };
  return configValues;
}

/**
 * This function gets or create sheet tabs if do not exist
 * 
 * @return {!object} targetTab.
 * @public
 */
function getOrCreateTab(tabName) {
  let targetTab;
  let sheetNames = spreadsheet.getSheets().map(e => e.getName());

  if (sheetNames.includes(tabName)) {
    targetTab = spreadsheet.getSheetByName(tabName);
  } else {
    targetTab = spreadsheet.insertSheet(tabName);
  }
  return targetTab;
}

/**
 * This function handle the report writing inside the SA360 Shopping Report sheet.
 * 
 * @public
 */
function writeReportToSheet(headers, values, sheetName) {
  if (values.length === 0) {
    throw new Error(`No results on execution: ${new Date()}`);
  } else {
    getOrCreateTab(sheetName);
    const reportSheet = spreadsheet.getSheetByName(sheetName).clearContents().appendRow(headers);
    let rows = [];

    for (let i in values) {
      let newRow = [];
      const metricsRow = [];
      const result = values[i];
      const productItemId = [result['segments']['productItemId']];
      const metrics = result['metrics'];

      if(metrics) {
        for(let f = 1; f <= headers.length-1; f++) {
          let metric = metrics[headers[f]] ? metrics[headers[f]] : 'N/A';
          metricsRow.push(metric);
        }
      }
      newRow = productItemId.concat(metricsRow);
      rows.push(newRow);

      if( i % BATCH_SIZE === 0 ) {
        reportSheet.getRange( 1 + reportSheet.getLastRow(), 1, rows.length, headers.length).setValues(rows);
        rows = [];
        // Update Status
        updateStatus(STATUS.IN_PROGRESS, parseInt(i), values.length);
      }
    }
    if(rows.length > 0){
      reportSheet.getRange( 1 + reportSheet.getLastRow(), 1, rows.length, headers.length).setValues(rows);
    }
  }
}

/**
 * This function handle the label writing inside the Product Feed Custom Labeling sheet.
 * 
 * @public
 */
function writeLabeledProductsToSheet(headers, values, sheetName) {
  if (values.length === 0) {
    throw new Error(`No results on execution: ${new Date()}`);
  } else {
    getOrCreateTab(sheetName);
    const labeledSheet = spreadsheet.getSheetByName(sheetName).clearContents().appendRow(headers);
    let rows = [];

    for (let i in values) {
      rows.push(values[i]);
      if( i % BATCH_SIZE === 0 ) {
        labeledSheet.getRange( 1 + labeledSheet.getLastRow(), 1, rows.length, headers.length).setValues(rows);
        rows = [];
        // Update Status
        //updateStatus(STATUS.IN_PROGRESS, parseInt(i), values.length);
      }
    }
    if(rows.length > 0){
      labeledSheet.getRange( 1 + labeledSheet.getLastRow(), 1, rows.length, headers.length).setValues(rows);
    }
  }
}

/**
 * This function updates the process status inside the named range of About sheet.
 * 
 * @public
 */
function updateStatus(msg, currentIndex=0, totalIndex=0) {
  switch (msg) {
    case STATUS.START:
    case STATUS.LABELING:
      spreadsheet.getRangeByName(RANGE_NAMES.STATUS).setValues([[msg]]);
      break;
    case STATUS.IN_PROGRESS:
      spreadsheet.getRangeByName(RANGE_NAMES.STATUS).setValues(
        [[`${STATUS.IN_PROGRESS}: ${currentIndex + 1}/${totalIndex} (${((currentIndex+1)*100/totalIndex).toFixed(2)}%)`]]
      );
      break;
    case STATUS.FINISH:
      let d = new Date();
      spreadsheet.getRangeByName(RANGE_NAMES.STATUS).setValues(
        [[`${STATUS.FINISH} on ${d.toLocaleString("en-US")}`]]
      );
      SpreadsheetApp.getActive().toast("All data processed");
      break;
    default:
      console.error('Unknown status');
  }
}
