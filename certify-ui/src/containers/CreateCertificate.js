import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import Config from '../config/env';

class CreateCertificate extends Component {

    constructor(props) {
      super(props);
      this.fileInput = React.createRef();

      this.state = {
        certificate : {},
        errorMsg : "",
        fileErrorMsg: ""
      }

      this.closeBtn = {
        right: "-7px",
        top: "-11px",
        "text-align": "center",
        cursor: "pointer"
      }
    }


    handleInputChange = (event) => {
      const target = event.target;
      const value =  target.value;
      const name = target.name;
      
      let formData = this.state.certificate;
      formData[name] = value
  
      this.setState({
        certificate: formData,
      });
    }

    handleArtistInputChange = (event) => {
      const target = event.target;
      const value =  target.value;
      const name = target.name;
      
      let formData = this.state.certificate;
      if( formData.artist ){
        formData["artist"][name] = value
      }else{
        formData["artist"] = {}
        formData["artist"][name] = value
      }

      this.setState({
        certificate: formData
      });
    }

    handleUpload = () => {
        let file = this.fileInput.current.files[0];

        let fileName = file.name;
        let fileType = file.type;
        if( !fileType.match(/png|jpg|gif|jpeg/) ){
          this.setState({
            fileErrorMsg : "Unsupported file type"
          })
          return;
        }

        if( Math.floor(file.size / 1000000) > 20 ){
          this.setState({
            fileErrorMsg : "File max limit exceeded"
          })
          return;
        }

        axios.post(Config.apiUrl + "upload",{
          fileName : fileName,
          fileType : fileType
        })
        .then(response => {
            const returnData = response.data;
            const signedRequest = returnData.signedRequest;
            const url = returnData.url;

          const options = {
            headers: {
              'Content-Type': fileType,
              'x-amz-acl': 'public-read'
            }
          };
          axios.put(signedRequest,file,options)
          .then(result => {
            let certificate = this.state.certificate;
            certificate["file"] = {}
            certificate["file"]["fileName"] = fileName;
            certificate["file"]["url"] = url;
            certificate["file"]["fileType"] = fileType;
            certificate["file"]["fileSize"] = file.size;
            this.setState({ certificate: certificate})
          })
          .catch(error => {
            alert("ERROR " + JSON.stringify(error));
          })
        })
        .catch(error => {
          alert(JSON.stringify(error));
        })
    }
    
    saveForm = (event) => {

      event.preventDefault();

      if( this.state.certificate.productionYear && !this.state.certificate.productionYear.match(/\d+/)){
        this.setState({
          errorMessage  : "Please enter valid production year"
        })
        return;
      }

      if( !this.state.certificate.artist || (!this.state.certificate.artist.firstName && !this.state.certificate.artist.lastName)){
        this.setState({
          errorMessage  : "Please enter valid artist name"
        })
        return;
      }

      if( !this.state.certificate.file){
        this.setState({
          errorMessage  : "Please upload the photo"
        })
        return;
      }

      axios.post( Config.apiUrl + "certificate", this.state.certificate).then((response) => {
        console.log(response)
      }).then(() => {
        this.props.history.push('/');
      }).catch((error) => {
        if(error.response){
            this.setState({
                errorMessage : error.response.data.error
            })
        }
      });
    }

    clearPhoto = () => {
      const certificate = this.state.certificate;
      delete certificate["file"];
      this.setState({
        certificate: certificate
      })
      this.fileInput.current.value = ""
    }


    render() {
      return (
        <div className="d-flex flex-column">
            <h2 className="m-4">Create Certificate</h2>
            <form className="p-2" onSubmit={this.saveForm}>
                <div className="d-flex flex-column flex-md-row">
                    <div className="m-3 flex-fill">
                        <div className="d-flex flex-column">
                        <label className="form-label">A photo of the artwork</label>
                        <input ref={this.fileInput} className="form-control file-input" type="file" onChange={this.handleUpload}/>
                         <small>Supported file types: .jpg, .png, .gif (Max Limit: 20MB)</small> 
                         {this.state.fileErrorMsg && <div className="alert alert-danger mt-2">{this.state.fileErrorMsg}</div>}
                        { this.state.certificate.file && this.state.certificate.file.url !== "" && 
                          <div className=" position-relative bg-white mt-2">
                            <img style={{'width':'8rem'}} 
                                className="" 
                                src={this.state.certificate.file.url} 
                                alt={this.state.certificate.file.url}
                            />
                            <div style={this.closeBtn} className="position-absolute" onClick={this.clearPhoto}>X</div>
                            
                          </div>
                        }

                        </div>

                    </div>
                    <div className="m-3 flex-fill">
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input name="title" type="text" className="form-control" id="title" placeholder="Title" onChange={this.handleInputChange}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Artist Name</label>
                            <div className="d-flex flex-row">
                              <input name="firstName" onChange={this.handleArtistInputChange} type="text" className="form-control flex-fill" id="artist" placeholder="First Name"/>
                              <input name="lastName" onChange={this.handleArtistInputChange} type="text" className="form-control ml-1 flex-fill" id="artist" placeholder="Last Name"/>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Production Year</label>
                            <input name="productionYear" onChange={this.handleInputChange} type="text" className="form-control" id="productionYear" placeholder="Production Year"/>
                        </div>
                    </div>
                </div>
                {this.state.errorMessage && <div className="alert alert-danger mt-2">{this.state.errorMessage}</div>}
                <div className="d-flex flex-row justify-content-end">
                    <button type="submit" className="btn btn-primary m-1">Save</button>
                    <Link to={'/'}><button type="button" className="btn btn-secondary m-1">Cancel</button></Link>  
                </div>
            </form>
        </div>
    )
    }

    
}

export default CreateCertificate;