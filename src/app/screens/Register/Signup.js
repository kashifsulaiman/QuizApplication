import React, { Component } from "react";
import AppBar from '@material-ui/core/AppBar';
import { register, firebase } from '../../configs/Firebase'
//import swal from '@sweetalert/with-react';
import swal from 'sweetalert'
import '../Login/style.css';
import { animateIn, animateOut } from '../Login/animate';
import logo from '../../../assests/images/logo.png';
import text from '../../../assests/images/text.png';
import Loader from '../Loader/Loader'
import CircularProgress from '@material-ui/core/CircularProgress';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            rePassword: '',
            errorMsgFirstName: '',
            errorMsgLastName: '',
            errorMsgEmail: '',
            errorMsgPassword: '',
            errorMsgNotMatch: '',
            notLog: false,
            isLoad: false
        };
    }


    componentDidMount() {
        this.checkForAuth()
    }

    checkForAuth = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.history.replace('/Categories')
            } else {
                this.setState({ notLog: true })
                animateIn(640)
            }
        });
    }

    validation() {
        const { firstName, lastName, email, password, rePassword } = this.state;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!firstName.length) {
            this.setState({ errorMsgFirstName: 'Enter your first name' });
            this.swalAlert('Enter your first name')
            return false
        }
        else if (!lastName.length) {
            this.setState({ errorMsgLastName: 'Enter your last name' });
            this.swalAlert('Enter your last name')
            return false
        }
        else if (!re.test(email.toLowerCase())) {
            this.setState({ errorMsgEmail: 'Enter valid email' });
            this.swalAlert('Enter valid email')
            return false;
        }
        else if (password.length < 8) {
            this.setState({ errorMsgPassword: 'Minimum length of password field is 8 characters' });
            this.swalAlert('Minimum length of password field is 8 characters')
            return false;
        } else if (password.length > 16) {
            this.setState({ errorMsgRePassowrd: 'Maximum length of password field is 16 characters' });
            this.swalAlert('Maximum length of password field is 16 characters')
            return false;
        }
        else if (password !== rePassword) {
            this.setState({ errorMsgNotMatch: 'password not matched' });
            this.swalAlert('password not matched')
            return false
        }
        return true;
    }


    swalAlert(message) {
        swal('Error!!', message, 'error')
    }

    signup = async (e) => {
        e.preventDefault()
        this.setState({ isLoad: true })
        const { firstName, lastName, email, password } = this.state;
        if (this.validation()) {
            try {
                await register({ firstName, lastName, email, password });
                this.setState({ firstName: '', lastName: '', email: '', password: '', rePassword: '' });
                this.setState({ isLoad: true })
                await animateOut()
                setTimeout(() => {
                    this.props.history.replace('/Categories')
                }, 3100);
            } catch (e) {
                this.setState({ isLoad: false })
                swal(
                    "Error!"
                    , e,
                    "error"
                )
            }
        }
    }

    goToLogin = async (e) => {
        e.preventDefault();
        await animateOut()
        setTimeout(() => {
            this.props.history.replace('/')
        }, 3100);
    }



    render() {
        const { notLog, isLoad } = this.state
        return (
            notLog ?
                <div>
                    <AppBar position="absolute">
                        <p>Register User</p>
                    </AppBar>
                    <div id="container">
                        <div id="inviteContainer">
                            <div className="logoContainer"><img className="logo" alt='...' src={logo} /><img className="text" alt='...' src={text} /></div>
                            <div className="acceptContainer">
                                <form>
                                    <h1 className='welcome'>WELCOME!</h1>
                                    <div className="formContainer">
                                        <div className="formDiv" style={{ transitionDelay: "0.2s" }}>
                                            <p style={{ color: '#fff' }}>FIRST NAME</p>
                                            <input type="text" required
                                                value={this.state.fullName}
                                                onChange={({ target }) => this.setState({ firstName: target.value })}
                                                onBlur={() => { this.setState({ errorMsgFirstName: '' }) }}
                                            />
                                        </div>
                                        <div className="formDiv" style={{ transitionDelay: "0.2s" }}>
                                            <p>LAST NAME</p>
                                            <input type="text" required
                                                value={this.state.lastName}
                                                onChange={({ target }) => this.setState({ lastName: target.value })}
                                                onBlur={() => { this.setState({ errorMsgLastName: '' }) }}
                                            />
                                        </div>
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
                                        </div>
                                        <div className="formDiv" style={{ transitionDelay: "0.4s" }}>
                                            <p>REPEAT PASSWSORD</p>
                                            <input type="password" required
                                                value={this.state.rePassword}
                                                onChange={({ target }) => this.setState({ rePassword: target.value })}
                                                onBlur={() => { this.setState({ errorMsgNotMatch: '' }) }}
                                            />
                                        </div>
                                        <div className="formDiv" style={{ transitionDelay: "0.6s" }}>
                                            <button className="acceptBtn" type="submit" onClick={this.signup}>
                                                {
                                                    isLoad ?
                                                        <CircularProgress color="primary" size={24} thickness={3} style={{ padding: '14.5px' }} />
                                                        :
                                                        <p style={{ color: '#fff', fontSize: '40', padding: '20px' }}>Sign Up</p>
                                                }
                                            </button><span className="register">Already have an account?<a href=".." onClick={this.goToLogin}>Login</a></span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <Loader />
        );
    }
}

export default Signup;
