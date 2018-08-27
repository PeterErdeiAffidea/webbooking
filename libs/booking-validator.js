const validator = require('validator');
const xssFilters = require('xss-filters');

exports.xssFilter = (bookingData) => {
  let escapedBookingData = {};
  escapedBookingData["insurance"] = xssFilters.inHTMLData(bookingData["insurance"]);
  escapedBookingData["service"] = xssFilters.inHTMLData(bookingData["service"]);
  escapedBookingData["center"] = xssFilters.inHTMLData(bookingData["center"]);
  escapedBookingData["date"] = xssFilters.inHTMLData(bookingData["date"]);
  escapedBookingData["time"] = xssFilters.inHTMLData(bookingData["time"]);
  escapedBookingData["user"] = {};
  escapedBookingData["user"]["title"] = xssFilters.inHTMLData(bookingData["user"]["title"]);
  escapedBookingData["user"]["firstName"] = xssFilters.inHTMLData(bookingData["user"]["firstName"]);
  escapedBookingData["user"]["lastName"] = xssFilters.inHTMLData(bookingData["user"]["lastName"]);
  escapedBookingData["user"]["birthDate"] = xssFilters.inHTMLData(bookingData["user"]["birthDate"]);
  escapedBookingData["user"]["gender"] = xssFilters.inHTMLData(bookingData["user"]["gender"]);
  escapedBookingData["user"]["personalNumbers"] = xssFilters.inHTMLData(bookingData["user"]["personalNumbers"]);
  escapedBookingData["user"]["medic"] = xssFilters.inHTMLData(bookingData["user"]["medic"]);
  escapedBookingData["user"]["medicSpeciality"] = xssFilters.inHTMLData(bookingData["user"]["medicSpeciality"]);
  escapedBookingData["user"]["address"] = {};
  escapedBookingData["user"]["address"]["address"] = xssFilters.inHTMLData(bookingData["user"]["address"]["address"]);
  escapedBookingData["user"]["address"]["city"] = xssFilters.inHTMLData(bookingData["user"]["address"]["city"]);
  escapedBookingData["user"]["address"]["zipCode"] = xssFilters.inHTMLData(bookingData["user"]["address"]["zipCode"]);
  escapedBookingData["user"]["address"]["email"] = xssFilters.inHTMLData(bookingData["user"]["address"]["email"]);
  escapedBookingData["user"]["address"]["mobile"] = xssFilters.inHTMLData(bookingData["user"]["address"]["mobile"]);
  escapedBookingData["user"]["address"]["phone"] = xssFilters.inHTMLData(bookingData["user"]["address"]["phone"]);
  return escapedBookingData;
};

exports.validate = (lang, bookingData) => {
  return validator.isEmail(bookingData['user']['address']['email']);
};
