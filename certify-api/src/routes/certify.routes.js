const CertifyController = require('../controller/certify.controller');

exports.routes = function (app) {

    app.post("/certificate", CertifyController.createCertificate)

    app.post("/certificate/:certificateID", CertifyController.updateCertificate)

    app.get("/certificate/all", CertifyController.getAllCertificates)

    app.get("/certificate/:id", CertifyController.getCertificateByID)

    app.post("/upload", CertifyController.uploadFile);

}