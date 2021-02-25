import React from 'react'


 const Certificate = (props) => {

    return ( 
        <div className="card m-2" style={{"width": "18rem"}}>
            <img style={{"height": "10rem"}} src={props.certificate.file.url} className="card-img-top" alt="..."/>
            <div className="d-flex flex-column p-3">
                <p className="card-text my-0">
                    {props.certificate.artist.firstName ? props.certificate.artist.firstName + " " : "" }
                    { props.certificate.artist.lastName ? props.certificate.artist.lastName : ""}
                </p>
                <h4 className="my-2"><strong><em>{props.certificate.title}</em></strong></h4>
                <p className="my-0">{props.certificate.productionYear}</p>
            </div>
        </div>
    )
}

export default Certificate