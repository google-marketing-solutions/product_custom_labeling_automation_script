/**
 * Calls an API via http/UrlFetchApp requests and return the response.
 * @param {!string} url - The URL of the REST API call to make.
 * @param {!Object} requestBody - The object containing the request parameters.
 * @param {?string} methodType - Value for the "method" option (GET/POST/...).
 * @param {?Object} additionalHeaders - The object containing the additonal header attributes.
 * @param {?string} contentType - The content type of the request.
 * @return {!Object} The API call response.
 * @private
 */
function callApi(url, requestBody, methodType="GET", additionalHeaders={}, withPagination) {
  var headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + ScriptApp.getOAuthToken(),
    ...additionalHeaders
  };

  var options = {
    method: methodType,
    headers: headers,
    muteHttpExceptions: true
  };
  if (requestBody) {
    options.payload = JSON.stringify(requestBody);
  }
  let results = [];
  let result = {};
  try {
    /** Do-while loop to support pagination. */
    do {
      let callUrl = !!result && result['nextPageToken'] ?
          `${url}&pageToken=${result['nextPageToken']}` :
          url;
      let res = UrlFetchApp.fetch(callUrl, options);
      result = JSON.parse(res);
      if (withPagination) {
        results.push(result);
      } else {
        return result;
      }
    } while (result['nextPageToken']);
    return results;
  } catch (e) {
    customLog_('API call error: ' + e.toString());
    throw e;
  }
}

/**
 * This function handle the API call to obtain campaigns product metrics from SA360.
 * Error handling in place to check if correct parameters have been set on the SQL query.
 * 
 * @return {!object} custom object that contains the API call results (i.e. SA360 products metrics).
 * @private
 */
function processQuery(customerId, startDate, endDate) {
  if(!customerId){
    throw new Error(`The selected customer ID (${customerId}) is not valid!`);
  }
  // Construct base service URL for new SA360 REST API based on provided CUSTOMER_ID value.
  const serviceURL = `https://searchads360.googleapis.com/v0/customers/${customerId}`;
  // Specify which API resource you wish to call, reference: https://developers.google.com/search-ads/reporting/api/reference/rest
  const resourceURL = `${serviceURL}/searchAds360:search`

  // Costruisci la query dinamicamente
  let whereClause = 'WHERE segments.product_item_id != "undefined"';

  let formattedStartDate, formattedEndDate = '';
  if (!!startDate) {
    //Format date AS yyyy-MM-dd and append it to the query
    formattedStartDate = Utilities.formatDate(new Date(startDate), Session.getScriptTimeZone(), "yyyy-MM-dd");
    whereClause += ` AND segments.date >= "${formattedStartDate}"`;
  }

  if (!!endDate) {
    //Format date AS yyyy-MM-dd and append it to the query
    formattedEndDate = Utilities.formatDate(new Date(endDate), Session.getScriptTimeZone(), "yyyy-MM-dd");
    whereClause += ` AND segments.date <= "${formattedEndDate}"`;
    if (!!startDate){
      dateConfiguration_(formattedStartDate, formattedEndDate);
    }
  }

  const finalQuery = `SELECT ${Object.keys(FIELDS).toString()} 
                      FROM shopping_performance_view 
                      ${whereClause}
                      ORDER BY segments.product_item_id`;

  console.log(finalQuery);

  const requestBody ={
    "query": finalQuery
  }
  const method = "POST";
  const headers = {
    "login-customer-id": customerId
  }
  const request = callApi(resourceURL, requestBody, method, headers, true);
  
  if( !request['0']['results']){
    customLog_(request['0']['error']['message']);
    throw new Error(request['0']['error']['message']);
  }

  return request['0']['results'];
}
