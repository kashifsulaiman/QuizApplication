import React, { Component } from 'react';
import { facebookLogin, firebase } from "../../configs/Firebase";
import './style.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import FacebookImage from './f.png';
import swal2 from 'sweetalert';


class GoogleLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMsgEmail: '',
            errorMsgPassword: '',
            notLog: false,
            isLoad: false
        };
    }


    loginWithFacebook = async () => {
        let res = await facebookLogin();
        console.log(res, "res<><>")
    }


    render() {
        let { isLoad } = this.state;
        return (
            <div className="App" >
                <button className="facebook-login" onClick={this.loginWithFacebook}>
                    {
                        isLoad ?
                            <CircularProgress color="primary" size={24} thickness={3} style={{ padding: '14.5px' }} />
                            :
                            <p style={{ color: '#fff', fontSize: '40', padding: '20px' }}>
                            <img src={FacebookImage} alt="facebook" style={{display: 'inline' ,  marginRight:'4px' , width: '12px' }}  />

                            Sign In With Facebook</p>
                    }
                </button>
            </div>
        );
    }
}

export default GoogleLogin;
