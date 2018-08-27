const XLSX = require('xlsx');

exports.readWorkbook = (xlsxFile) => {
  let workBook = XLSX.readFile(xlsxFile);
  var database = {};
  let workSheets = workBook.Sheets;
  for (let sheetName in workSheets) {
    console.debug("Load data for [" + sheetName + "]");
    database[sheetName] = processSheet(workSheets[sheetName]);
  }
  return database;

};
function processSheet(sheet) {
  let sheetInJson = XLSX.utils.sheet_to_json(sheet);

  var insurances = [];
  var services = [];
  var centersMap = new Map();
  var centerEmails = new Map();

  sheetInJson.forEach((row) => {
    if (row.__rowNum__ > 0) {
      let insurance = row["Insurance type"];
      let service = row["Service"];
      let center = row["Center"];
      let serviceInCenter = row["Available service"];
      let centerEmail = row["Email"];

      if (insurance !== undefined) {
        insurances.push(insurance);
      }
      if (service !== undefined) {
        services.push(service);
      }

      if (centerEmail !== undefined && center !== undefined && !centerEmails.has(center)) {
        centerEmails.set(center, centerEmail);
      }

      if (center !== undefined && serviceInCenter !== undefined) {
        if (centersMap.has(center)) {
          let currentCenter = centersMap.get(center);
          currentCenter.push(serviceInCenter);
        } else {
          let array = new Array(serviceInCenter);
          centersMap.set(center, array);
        }
      }
    }
  });

  var centers = [];
  centersMap.forEach((value, key, map) => {
    centers.push({"name": key, "services": value});
  });

  // console.debug("Insurances:", insurances.length);
  // console.debug("Services:", services.length);
  // console.debug("Centers:", centers.length);

  return {
    "insurances": insurances,
    "services": services,
    "centers": centers,
    "emails": centerEmails
  };
}