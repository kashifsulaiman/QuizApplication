import React, { Component } from 'react';
import { googleLogin, firebase } from "../../configs/Firebase";
import './style.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import GoogleImage from './g.png';
import swal2 from 'sweetalert';
import History from '../../../app/configs/history';


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

    // checkForAuth = () => {
    //     let obj = {};
    //     firebase.auth().onAuthStateChanged((user) => {
    //         if (user) {
    //             firebase.firestore().collection('users').get()
    //                 .then(doc => {
    //                     doc.forEach((item) => {
    //                         // console.log(item.data() , "???")

    //                         console.log(user.email === item.data().email, "LLGG")
                           
    //                     })
    //                 })



    //         }
    //         else {
    //             History.push('/');

    //         }
    //     });
    // }




    withGoogle = async () => {
        // this.checkForAuth()
        let res = await googleLogin();
        console.log(res, "res<><>")
    }

    // async withGoogle() {
    //     const googleProvider = googleLogin();

    //     await this.auth.signInWithRedirect(googleProvider);

    //     // The error is thrown here, and then caught by the .catch(), which is unexpected, because as mentioned, the accounts are already linked.
    //     const result = await this.afAuth.auth.getRedirectResult()
    //       .catch(this.linkIfDuplicateAccount);

    //     // ... rest of code left out, as its irrelevant.
    //  }

    render() {
        let { isLoad } = this.state;
        return (
            <div className="App" >
                <button className="google-login" onClick={this.withGoogle.bind(this)}>
                    {
                        isLoad ?
                            <CircularProgress color="primary" size={24} thickness={3} style={{ padding: '14.5px' }} />
                            :

                            <p style={{ color: '#fff', fontSize: '40', padding: '20px' }}>
                                <img src={GoogleImage} alt="google" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', width: '15px' }} />

                                Sign In With Google</p>
                    }

                </button>
            </div>
        );
    }
}

export default GoogleLogin;
