const restify = require('restify');
const i18n = require('i18n');

const config = require('./config.js');
const AffineDatabase = require('./libs/affidea-database.js');
const Booking = require('./libs/booking.js');

const affineDatabase = new AffineDatabase(config.bookingData.path);
const booking = new Booking(config.email);

i18n.configure({
  locales: config.i18n.locales,
  directory: config.i18n.path
});

const app = restify.createServer();

app.use(i18n.init);

app.get("/check", (request, response) => {
  okResponse(response, "OK");
});

app.get('/:language/insurances', (request, response) => {
  let language = request.params.language;
  let result = affineDatabase.listInsurances(language);
  okResponse(response, result);
});

app.get('/:language/services', (request, response) => {
  let language = request.params.language;
  let result = affineDatabase.listServices(language);
  okResponse(response, result);
});

app.get('/:language/centers', (request, response) => {
  let language = request.params.language;
  let result = affineDatabase.listCenters(language);
  okResponse(response, result);
});

app.get('/:language/availableCenters/:service', (request, response) => {
  let language = request.params.language;
  let service = request.params.service;
  let result = affineDatabase.listAvailableCenters(service, language);
  okResponse(response, result);
});

app.use(restify.plugins.bodyParser());

app.post('/:language/booking', (request, response) => {
  let language = request.params.language;
  let body = request.body;

  i18n.setLocale(language);

  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Methods', "POST");

  let bookingSuccess = false;
  try {
    bookingSuccess = booking.booking(i18n, body, affineDatabase);
  } catch (error) {
    console.error(error);
    response.send(500);
    return;
  }

  if (bookingSuccess) {
    response.send(200, "OK");
  } else {
    response.send(200, "ERROR");
  }
});

app.get('/:language/languageData', (request, response) => {
  i18n.setLocale(request.params.language);
  okResponse(response, {
    "bookingDivTitle": i18n.__('bookingTitle'),
    "bookingActionLabel": i18n.__('bookingActions'),
    "bookingNextButton": i18n.__('bookingNextButtonLabel'),
    "bookingDateLabel": i18n.__('date'),
    "bookingTimeLabel": i18n.__('time'),
    "bookingAcceptPolicyLabel": i18n.__('acceptPolicy'),
    "insuranceSelectDefault": i18n.__('insuranceSelectDefault'),
    "serviceSelectDefault": i18n.__('serviceSelectDefault'),
    "centerSelectDefault": i18n.__('centerSelectDefault'),
    "userFormDialogTitle": i18n.__('formDialogTitle'),
    "userFormDialogOk": i18n.__('formDialogOk'),
    "userFormDialogCancel": i18n.__('formDialogCancel'),
    "titleInputLabel": i18n.__('formUserTitle'),
    "titleInputMr": i18n.__('fromUserTitleMr'),
    "titleInputMrs": i18n.__('fromUserTitleMrs'),
    "titleInputMs": i18n.__('fromUserTitleMs'),
    "firstNameInputLabel": i18n.__('formFirstName'),
    "lastNameInputLabel": i18n.__('formLastName'),
    "birthDateInputLabel": i18n.__('formBirthDate'),
    "sexFemaleLabel": i18n.__('formFemale'),
    "sexMaleLabel": i18n.__('formMale'),
    "addressInputLabel": i18n.__('formAddress'),
    "cityInputLabel": i18n.__('formCity'),
    "zipInputLabel": i18n.__('formZip'),
    "emailInputLabel": i18n.__('formEmail'),
    "confirmEmailInputLabel": i18n.__('formConfirmEmail'),
    "mobilInputLabel": i18n.__('formMobile'),
    "phoneInputLabel": i18n.__('formPhone'),
    "personalNumericNumberInputLabel": i18n.__('formPersonalNumber'),
    "medicInputLabel": i18n.__('formMedic'),
    "medicSpecialityInputLabel": i18n.__('formMedicSpecialty'),
    "fieldsRequiredLabel": i18n.__('fieldsRequired'),
    "acceptPolicyInputLabel": i18n.__('acceptPolicyLong'),
    "acceptPolicyInputLink": i18n.__('acceptPolicyLinkLabel'),
    "acceptPolicyLinkUrl": i18n.__('acceptPolicyLink'),
    "datePickerDateFormat": i18n.__('datePickerDateFormat'),
    "resultDialogTitle": i18n.__('resultDialogTitle'),
    "resultDialogOk": i18n.__('resultDialogOk'),
    "resultDialogSuccessMessage": i18n.__('resultDialogSuccessMessage'),
    "resultDialogFailedMessage": i18n.__('resultDialogFailedMessage')
  });
});

app.on('InternalServer', (request, response, error, callback) => {
  return callback;
});
app.on('restifyError', (request, response, error, callback) => {
  return callback;
});

app.listen(config.port, config.host, () => {
  console.log('The %s listening at %s', app.name, app.url);
});

function okResponse(response, result) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Methods', "GET, POST");
  response.send(200, result);
}