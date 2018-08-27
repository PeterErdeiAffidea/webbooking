const excel = require('./excel-processor.js');

const INSURANCES = "insurances";
const SERVICES = "services";
const CENTERS = "centers";
const EMAILS = "emails";

module.exports = class AffideaDatabase {
  constructor(xlsxFile) {
    this.jsonDb = excel.readWorkbook(xlsxFile);
    console.debug("Initialize booking database, done.");
  }
  
  listInsurances(languageCode) {
    let dbByLanguage = this.jsonDb[languageCode];
    if (dbByLanguage === undefined) {
      return [];
    }

    let insurances = dbByLanguage[INSURANCES];
    return insurances;
  }
  
  listServices(languageCode) {
    let dbByLanguage = this.jsonDb[languageCode];
    if (dbByLanguage === undefined) {
      return [];
    }

    let services = dbByLanguage[SERVICES];
    return services;
  }

  listCenters(languageCode) {
    let dbByLanguage = this.jsonDb[languageCode];
    if (dbByLanguage === undefined) {
      return [];
    }

    let centers = dbByLanguage[CENTERS].map((center) => {
      return center["name"];
    });

    return centers;
  }
  
  listAvailableCenters(service, languageCode) {
    let dbByLanguage = this.jsonDb[languageCode];
    if (dbByLanguage === undefined) {
      return [];
    }

    let availableCenters = dbByLanguage[CENTERS].filter((center) => {
      return center[SERVICES].indexOf(service) > -1;
    }).map((center) => {
      return center["name"];
    });

    return availableCenters;
  }

  emailByCenter(languageCode, center) {
    let dbByLanguage = this.jsonDb[languageCode];
    if (dbByLanguage === undefined) {
      return [];
    }

    return dbByLanguage[EMAILS].get(center);
  }

};
