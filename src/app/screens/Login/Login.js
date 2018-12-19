import React, { Component } from "react";
import AppBar from '@material-ui/core/AppBar';
import { login, firebase } from "../../configs/Firebase";
import swal2 from 'sweetalert';
import './style.css';
import { animateIn, animateOut } from './animate';
import Loader from '../Loader/Loader';
import logo from '../../../assests/images/logo.png';
import text from '../../../assests/images/text.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import GoogleLogin from './GoogleLogin';
import FacebookLogin from './FacebookLogin';


class Login extends Component {
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


    componentDidMount = async () => {
        await this.checkForAuth()
    }

    checkForAuth = () => {
        let obj = {};
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                        firebase.firestore().collection('users').get()
                        .then((item) => {
                            item.forEach(element => {
                                console.log(element.data() , ">>>>>>>>>>>>>>>>")
                                // console.log(item.data(), "#######################")
                                if (element.data().isAdmin) {
                                    
                                this.props.history.push('/CreateCategories')
                                
                            }

                            
                            
                            else {
                                this.setState({ isLoad: false })
                                this.props.history.push('Categories')
                                
                            }
                        });
                    })
            }
             else {
                this.setState({ notLog: true })
                animateIn(531.5)
                this.props.history.push('/')

            }
        });
    }
    
    validation() {
        const { email, password } = this.state;
        // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email.length) {
            this.setState({ errorMsgEmail: 'Enter your email' });
            this.swalAlert('Enter valid email')
            return false
        }
        else if (!password.length) {
            this.setState({ errorMsgPassword: 'Enter your password' });
            this.swalAlert('Enter your password')
            return false
        }
        return true;

    }

    swalAlert(message) {
        swal2('Error!!', message, 'error')
    }

    login = async (e) => {
        e.preventDefault()
        this.setState({ isLoad: true })
        const { email, password } = this.state;
        if (this.validation()) {
            try {
                let res = await login({ email, password });
                this.setState({ email: '', password: '' });
                firebase.firestore().collection('users').doc(res.user.uid).get()
                    .then(doc => {
                        if (doc.data().isAdmin) {
                            this.props.history.push('/CreateCategories')
                        }
                        else {
                            this.setState({ isLoad: false });
                                this.props.history.push('/Categories');
                        }1
                    });
            } catch (e) {
                this.setState({ isLoad: false })
                swal2('Error', e.message, 'error'
                )
            }
        }
    }

    goToRegister = (e) => {
        e.preventDefault();
        animateOut();
        setTimeout(() => {
            this.props.history.replace('/Signup')
        }, 3100);
    }


    render() {
        const { notLog, isLoad } = this.state
        return (
            notLog ?
                < div id="mainContainer">
                    <AppBar position="absolute">
                        <p style={{ color: '#fff' }}>User Login</p>
                    </AppBar>
                    <div id="container">
                        <div id="inviteContainer">
                            <div className="logoContainer"><img className="logo" src={logo} alt='...' /><img className="text" src={text} alt='...' /></div>
                            <div className="acceptContainer">
                                <form>
                                    <h1 className='welcome'>WELCOME BACK!</h1>
                                    <div className="formContainer">
                                        <div className="formDiv" style={{ transitionDelay: "0.2s" }}>
                                            <p>EMAIL</p>
                                            <input type="email" required
                                                value={this.state.email}
                                                onChange={({ target }) => this.setState({ email: target.value })}
                                                onBlur={() => { this.setState({ errorMsgEmail: '' }) }}
                                            />
                                        </div>
                                        <div className="formDiv" style={{ transitionDelay: "0.4s" }}>
                                            <p>PASSWSORD</p>
                                            <input type="password" required
                                                value={this.state.password}
                                                onChange={({ target }) => this.setState({ password: target.value })}
                                                onBlur={() => { this.setState({ errorMsgPassword: '' }) }}
                                            />
                                            <a className="forgotPas" href="...">FORGOT YOUR PASSWORD?</a>
                                        </div>
                                        <div className="formDiv" style={{ transitionDelay: "0.6s" }}>
                                            <button className="acceptBtn" type="submit" onClick={this.login} >
                                                {
                                                    isLoad ?
                                                        <CircularProgress color="primary" size={24} thickness={3} style={{ padding: '14.5px' }} />
                                                        :
                                                        <p style={{ color: '#fff', fontSize: '40', padding: '20px' }}>Login</p>
                                                }
                                            </button>
                                            <GoogleLogin />
                                            <FacebookLogin />
                                            <span className="register">Need an account?
                                            <a href="/" onClick={this.goToRegister}>Register</a>
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
                :
                <Loader />
        );
    }
}

export default Login;
