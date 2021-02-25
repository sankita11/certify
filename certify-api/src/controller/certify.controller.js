const CertifyModel = require('../model/certify.model');
const AWSSdk = require('../utils/aws-sdk');

CertifyModel.initializeDB();


exports.uploadFile = ( req, res ) => {
    AWSSdk.getS3SignedURL(req.body, (error, result) => {
        if( error ){
            res.status(500).send( { "error" : error})
        }else{
            res.send(result);
        }
    })
}  

exports.createCertificate = async ( req, res) => {

    const certificate = req.body;
    if( certificate.productionYear && !certificate.productionYear.match(/\d+/)){
        res.status(422).send({
          errorMessage  : "Invalid production year"
        })
        return;
    }

    if( !certificate.artist || (!certificate.artist.firstName && !certificate.artist.lastName)){
        res.status(422).send({
          errorMessage  : "Please check your input, artist name is missing"
        })
        return;
    }

    if( !certificate.file){
        res.status(422).send({
          errorMessage  : "No photo found"
        })
        return;
    }

    CertifyModel.createCertificate(certificate, (certificateID, error) => {
        if(error){
            res.status(500).send({
                "error": "Error in creating certificate",
                
            })
        }else{
            res.send({
                "success": "Certificate created",
                "certificateID" : certificateID
            })
    
        }
    })
    
}

exports.getAllCertificates = ( req, res) => {

    const sortBy = req.query.sortBy ;
    CertifyModel.getAllCerificates( sortBy, ( certificateArr ) => {
        res.send(certificateArr);
    })

}

exports.getCertificateByID = ( req, res) => {

    CertifyModel.getCertificateByID( req.params.id, ( certificate ) => {
        res.send(certificate);
    })

}

exports.updateCertificate  = ( req, res) => {

    CertifyModel.updateCertificate(req.body, req.params.certificateID);

    res.send({});
}

exports.deleteCerificate  = ( req, res) => {


}


