import React, { Component } from 'react';
import Styles from './Styles'
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { login, userUpdate } from "../../configs/Firebase";
import firebase from 'firebase';
import Loader from '../Loader/Loader';
import CircularProgress from '@material-ui/core/CircularProgress'

class Result extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ansCount: this.props.location.state.result,
            percentage: 0
        }
        this.checkForAuth(props, this.state)
    }

    checkForAuth = (props, states) => {
        if (JSON.parse(localStorage.getItem('quizIsInUnderWay'))) {
            return this.props.history.replace('/QuizStarting')
        }
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                props.history.replace('/')
            } else {
                states.isLog = true
            }
        });
    }
    componentWillMount() {
        this.checkForAuth();
    }

    checkForAuth = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.props.history.replace('/')
            } else {
                let per = this.state.ansCount * 100 / this.props.location.state.total;
                this.setState({ percentage: per, isLog: true }, () => { this.updateResult() });
            }
        });
    }

    async updateResult() {
        var user = firebase.auth().currentUser;
        if (user) {
            const res = await userUpdate(user.uid, { ['result.' + this.props.location.state.quizName]: this.state.percentage });
        }
    }

    logOut = () => {
        firebase.auth().signOut().then(() => {
            this.props.history.replace('/')
        })
    }

    render() {
        const { isLog } = this.state
        return (
            isLog ?
                <div>
                    <div style={styles.header}>
                        <p>Result</p>
                        <Button variant="contained" color="secondary" style={styles.btnLogout} onClick={this.logOut}>
                            <span style={{ color: '#fff', padding: '0' }}>Logout</span>
                        </Button>
                    </div>
                    <p style={{ fontWeight: 'bold', fontSize: 25 }}>Your result is : {Math.round(this.state.percentage) + "%"}</p>
                    <p style={{ fontWeight: 'bold', fontSize: 25 }}>You will be updated shortly about the selection <br /> Join this group for more info https://web.facebook.com/groups/2287964994823763/ </p>
                    <Button style={{ width: 200, height: 50, marginTop: 30 }} variant="contained" color="secondary" onClick={() => this.props.history.push('/Categories')}>
                        Back to Home
                </Button>
                </div>
                :
                <Loader />
        )
    }
}

const styles = {
    header: {
        display: "flex",
        justifyContent: "center"
    },
    btnLogout: {
        position: 'absolute',
        right: '30px',
        top: '8px'
    }
}


export default Result