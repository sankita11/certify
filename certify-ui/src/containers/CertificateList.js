import React, {Component} from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios';

import Config from '../config/env';
import Certificate from '../components/Certificate';

class CertificateList extends Component {

    constructor(props){
        super(props)

        this.state = {
            certificates : [],
        }
    }

    componentDidMount(){
        this.fetchCertificateList();        
    }

    fetchCertificateList = () => {
        axios.get(Config.apiUrl + 'certificate/all').then(response => {
            this.setState({
                certificates: response.data
            })
        }).catch((error) => {
            console.log(error)
        });
    }

    render() {
        
        if( this.state.certificates.length === 0 ){
            return (
                <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                    <div className="d-flex flex-column">
                    <h4>GET STARTED</h4>
                    <p>Your are click away to creating your first certificate</p>
                    <Link to={'/new'}>
                    <div className="mb-2">
                        <button className="btn btn-primary" onClick={this.showAddForm}>Create Certificate</button>
                    </div>
                </Link>
                        
                    </div>
                </div>
            )
        }

        const certificates = this.state.certificates.map((eachCertificate) => {
            return <Certificate key={eachCertificate.id} certificate={eachCertificate}/>
        })

        return(
            <div className="d-flex flex-column mt-5">
                <Link to={'/new'}>
                    <div className="m-2">
                        <button className="btn btn-primary" onClick={this.showAddForm}>Create Certificate</button>
                    </div>
                </Link>
                <div className="d-flex flex-row flex-wrap flex-shrink">
                    {certificates}
                </div>
            </div>
               
        );
    }
}

export default CertificateList;