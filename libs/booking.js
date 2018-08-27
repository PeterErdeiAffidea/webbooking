const Email = require('email-templates');
const path = require('path');

const mailSender = require('./mail-sender.js');
const bookingValidator = require('./booking-validator');

module.exports = class Booking {

  constructor(emailConfig) {
    this.email = new Email({
      views: {
        root: path.join(__dirname, '..', 'assets', 'emails')
      },
      message: {
        from: emailConfig.from,
        attachments: [{
          filename: "horizontal-logo-inverse.png",
          path: path.join(__dirname, '..', 'assets', 'images', "horizontal-logo-inverse.png"),
          cid: 'horizontal-logo-inverse'
        }]
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '..', 'assets')
        }
      },
      preview: false,
      send: true,
      transport: mailSender.createTransporter(emailConfig)
    });
    console.debug("Initialize booking, done.")
  }

  booking(i18n, bookingData, affineDatabase) {
    let lang = i18n.getLocale();
    if (bookingValidator.validate(lang, bookingData)) {
      let escapedBookingData = bookingValidator.xssFilter(bookingData);
      let localObj = {
        mailTitleClinic: i18n.__('mailTitleClinic'),
        mailTitlePatient: i18n.__('mailTitlePatient'),
        mailBookingDataPatient: i18n.__('mailBookingDataPatient'),
        mailBookingDataClinic: i18n.__('mailBookingDataClinic'),
        mailPatientData: i18n.__('mailPatientData'),
        mailInsurances: i18n.__('mailInsurances'),
        mailService: i18n.__('mailService'),
        mailCenter: i18n.__('mailCenter'),
        mailDatetime: i18n.__('mailDatetime'),
        mailPersonalNumbers: i18n.__('mailPersonalNumbers'),
        mailMedic: i18n.__('mailMedic'),
        mailMedicSpeciality: i18n.__('mailMedicSpeciality'),
        mailName: i18n.__('mailName'),
        mailGender: i18n.__('mailGender'),
        mailBirthDate: i18n.__('mailBirthDate'),
        mailAddress: i18n.__('mailAddress'),
        mailEmail: i18n.__('mailEmail'),
        mailPhone: i18n.__('mailPhone'),
        footer: i18n.__('mailFooterMessage'),
        title: escapedBookingData["user"]["title"],
        name: escapedBookingData["user"]["firstName"] + " " + escapedBookingData["user"]["lastName"],
        insurance: escapedBookingData["insurance"],
        service: escapedBookingData["service"],
        center: escapedBookingData["center"],
        date: escapedBookingData["date"],
        time: escapedBookingData["time"],
        personalNumbers: escapedBookingData["user"]["personalNumbers"],
        medic: escapedBookingData["user"]["medic"],
        medicSpeciality: escapedBookingData["user"]["medicSpeciality"],
        gender: escapedBookingData["user"]["gender"],
        birthDate: escapedBookingData["user"]["birthDate"],
        zipCode: escapedBookingData["user"]["address"]["zipCode"],
        city: escapedBookingData["user"]["address"]["city"],
        address: escapedBookingData["user"]["address"]["address"],
        email: escapedBookingData["user"]["address"]["email"],
        mobile: escapedBookingData["user"]["address"]["mobile"],
        phone: escapedBookingData["user"]["address"]["phone"]
      };

      let patientEmail = bookingData["user"]["address"]["email"];
      let patientMailOpts = {
        template: 'booking-patient',
        message: {
          to: patientEmail
        },
        locals: localObj
      };

      let clinicEmail = affineDatabase.emailByCenter(lang, escapedBookingData["center"]);

      let clinicMailOpts = {
        template: 'booking-clinic',
        message: {
          to: clinicEmail
        },
        locals: localObj
      };

      this.email.send(clinicMailOpts)
        .then((content) => {
          console.info(content);
        }).catch((err) => {
          console.error(err);
        });
      this.email.send(patientMailOpts)
        .then((content) => {
          console.info(content);
        }).catch((err) => {
          console.error(err);
        });
      return true;
    }

    return false;
  }
};

