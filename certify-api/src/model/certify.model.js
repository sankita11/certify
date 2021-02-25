const db = require('../db/db');

exports.initializeDB = async () => {    

    db.serialize( () => {
         db.run(`CREATE TABLE if not exists certificate (
            id INTEGER PRIMARY KEY ASC AUTOINCREMENT, 
            title TEXT,
            fileID INTEGER, 
            artistID INTEGER, 
            productionYear INTEGER, 
            createdOn INTEGER,
            updatedOn INTEGER)`);

        db.run(`CREATE TABLE if not exists certificateImage (
            id INTEGER PRIMARY KEY ASC AUTOINCREMENT, 
            url TEXT,
            fileType TEXT, 
            fileSize INTEGER, 
            createdOn INTEGER )`);

        db.run(`CREATE TABLE if not exists artist (
            id INTEGER PRIMARY KEY ASC AUTOINCREMENT, 
            firstName TEXT, 
            lastName TEXT, 
            addedOn INTEGER)`);
    })
    
}



exports.createCertificate =  async (certificate, callback) => {

    const date = new Date().getTime();
    db.serialize(async () => {

        const fileValues = [null, certificate.file.url, certificate.file.fileType, certificate.file.fileSize, date];
        const fileStmt = db.prepare(`INSERT INTO certificateImage values(?,?,?,?,?)`)
        let fileID = 0
        fileStmt.run(fileValues, function( error){
            if( error ) {
                console.log( error )
                callback(null, "Error")
                return;
            }
            fileID = this.lastID;
        })

        getArtist(certificate.artist, ( artistID ) => {
            if( artistID == 0 ){
                createArtist(certificate.artist, (createdArtistID) => {
                    const certificateValues = [null, certificate.title, fileID, createdArtistID, certificate.productionYear, date, date];
                    const createCertificateStmt = db.prepare( `INSERT INTO certificate values(?,?,?,?,?,?,?)`,(error) => {
                        if( error ) {
                            console.log( error )
                            callback(null, "Error")
                            return;
                        }
                    });
                    createCertificateStmt.run(certificateValues, function( error ) {
                        if( error ) {
                            console.log( error )
                            callback(null, "Error")
                            return;
                        }
                        callback(this.lastID);
                    })
                });
            }else{
                const certificateValues = [null,certificate.title, fileID, artistID, certificate.productionYear, date, date];
                const createCertificateStmt = db.prepare( `INSERT INTO certificate values(?,?,?,?,?,?,?)`,(error) => {
                    if( error ) {
                        console.log( error )
                        callback(null, "Error")
                        return;
                    }
                });
                createCertificateStmt.run(certificateValues, function( error ) {
                    if( error ) {
                        console.log( error )
                        callback(null, "Error")
                        return;
                    }
                    callback(this.lastID);
                })

            }
        })
    })       
}

exports.updateCertificate = async (certificate, certificateID, callback) => {

    const currentDate = new Date().getTime();
    db.serialize(() => {
        if( certificate.fileID == 0 ){
            const fileValues = [null, certificate.file.url, certificate.file.fileType, certificate.file.fileSize, date];
            const fileStmt = db.prepare(`INSERT INTO certificateImage values(?,?,?,?,?)`)
            fileStmt.run(fileValues, function( error){
                if( error ) {
                    console.log( error )
                    callback(null, "Error")
                    return;
                }
                certificate.fileID = this.lastID;
            })
        }

        getArtist(certificate.artist, ( artistID ) => {
            if( artistID == 0 ){
                createArtist(certificate.artist, (createdArtistID) => {
                    const updateStmt = db.prepare(
                        `UPDATE certificate SET 
                        artistID = ?, 
                        fileID = ?, 
                        productionYear = ? ,
                        updatedOn = ?
                        WHERE id = ?`)
                    updateStmt.run([createdArtistID, certificate.fileID, certificate.productionYear, currentDate, certificateID ])
                 });
            }else{
                const updateStmt = db.prepare(
                    `UPDATE certificate SET 
                    artistID = ?, 
                    fileID = ?, 
                    productionYear = ?,
                    updatedOn = ?
                    WHERE id = ?`)
                updateStmt.run([artistID, certificate.fileID, certificate.productionYear, currentDate, certificateID ])

            }
        })
    })
}

exports.getAllCerificates = async ( sortBy, callback ) => {

    const sortByMap = {
        "firstName" : "artist.firstName",
        "lastName" : "artist.lastName",
        "createdBy" : "certificate.createdOn"
    }

    sortBy =  sortBy && sortByMap[sortBy] ? sortByMap[sortBy] : "updatedOn";

    const certificatesArr = [];
    db.serialize(() => {
        db.each( `SELECT certificate.*, certificateImage.url, certificateImage.fileType, 
        certificateImage.fileSize, artist.firstName, artist.lastName
        FROM certificate JOIN artist 
        ON( certificate.artistID = artist.id )
        JOIN certificateImage ON ( certificate.fileID= certificateImage.id) 
        ORDER BY ${sortBy}`,[], 
            (error, certificateRow ) => {
                const certificate = {
                    "id" : certificateRow.id,
                    "title" : certificateRow.title,
                    "artistID": certificateRow.artistID,
                    "fileID": certificateRow.fileID,
                    "productionYear": certificateRow.productionYear,
                    "artist" : {
                        "firstName" : certificateRow.firstName,
                        "lastName" : certificateRow.lastName
                    },
                    "file" : {
                        "url" : certificateRow.url,
                        "fileSize": certificateRow.fileSize,
                        "fileType" : certificateRow.fileType
                    }
                }
                certificatesArr.push(certificate)
        }, () => {
            callback(certificatesArr)
        })
    
    })

}

exports.getCertificateByID = async ( certificateID, callback ) => {

    db.get( `SELECT certificate.*, certificateImage.url, certificateImage.fileType, 
    certificateImage.fileSize, artist.firstName, artist.lastName
    FROM certificate JOIN artist 
    ON( certificate.artistID = artist.id )
    JOIN certificateImage ON ( certificate.fileID= certificateImage.id) WHERE certificate.id = ?`, [certificateID], (error, certificateRow ) => {
 
         const certificate = {
            "id" : certificateRow.id,
            "title" : certificateRow.title,
            "artistID": certificateRow.artistID,
            "fileID": certificateRow.fileID,
            "productionYear": certificateRow.productionYear,
            "artist" : {
                "firstName" : certificateRow.firstName,
                "lastName" : certificateRow.lastName
            },
            "file" : {
                "url" : certificateRow.url,
                "fileSize": certificateRow.fileSize,
                "fileType" : certificateRow.fileType
            }
        }
        callback(certificate);
    })

}

const getArtistByID = async (artistID, callback) => {

    db.get(`SELECT * FROM artist WHERE id = ?`, 
        [artistID],
        function(error, result ){
            callback(result)
        }
    );

}

const getArtist = async (artist, callback) => {

    db.get(`SELECT * FROM artist WHERE firstName = ? and lastName = ?`, 
        [artist.firstName, artist.lastName],
        function(error, result ){
            if( result ){
                artistID = result.id;
                callback(artistID);
            }else{
                callback(0);
            }
        }
    );

}

const createArtist = async (artist, callback) => {

    const date = new Date().getTime();
    const artistValues = [null, artist.firstName, artist.lastName, date]

    db.serialize(()=> {
        const createArtistStmt = db.prepare("INSERT INTO artist values( ?, ?, ?, ?)");
        let artistID = 0 ;
        createArtistStmt.run(artistValues, function( error ) {
            if( error ) {
                console.log( error )
                return "Error"
            }else{
                artistID = this.lastID;
                callback(artistID)
            }
        })
    })

    
}