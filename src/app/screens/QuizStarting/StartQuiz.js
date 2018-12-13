import React, { Component } from 'react';
import Styles from './Styles'
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Countdown from 'react-countdown-now';
import { firebase } from '../../configs/Firebase';
import Loader from '../Loader/Loader';
import CircularProgress from '@material-ui/core/CircularProgress'

class StartQuiz extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            time: '',
            quiz: '',
            name: '',
            currentIndex: [],
            correctAns: 0,
            dateNow: Date.now()

        };
        this.submitQuestion = this.submitQuestion.bind(this);

    }



    componentWillMount() {

    }

    componentDidMount = async () => {
        await this.checkForAuth()

    }

    checkForAuth = () => {
        if (!localStorage.getItem('quiz')) {
            return this.props.history.push('/Categories')
        }
        this.setState({
            quiz: JSON.parse(localStorage.getItem('quiz')),
            time: (Date.now() + ((parseInt(parseInt(JSON.parse(localStorage.getItem('quiz')).Duration) * 60000))))
        })
        localStorage.setItem('quizIsInUnderWay', JSON.stringify(true))
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.props.history.replace('/')
            } else {
                const localTime = localStorage.getItem(('localTime' + this.state.quiz.name));
                this.setState({
                    localTime: localTime,
                    isLog: true,
                })
            }
        });
    }



    handleChange(i, op) {
        this.setState({ currentIndex: i });
        let addKey = this.state.quiz;
        addKey.questions[i].index = i;
        addKey.questions[i].option = op;
        this.setState({ quiz: addKey });
    };

    submitQuestion() {
        var count = 0;
        const { quiz } = this.state;
        quiz.questions.map((ques) => {
            if (ques.correct_answer == ques.option) {
                count = count + 1;
            }
        });
        localStorage.removeItem('quizIsInUnderWay')
        localStorage.removeItem('quiz')
        localStorage.removeItem(('localTime' + this.state.quiz.name))
        this.setState({ correctAns: count, total: quiz.questions.length, quizName: quiz.category + ' | ' + quiz.name }, () => { this.goResult() });
    }
    goResult() {
        this.props.history.replace('/Result', { result: this.state.correctAns, quizName: this.state.quizName, total: this.state.total })
    }

    logOut = () => {
        firebase.auth().signOut().then(() => {
            this.props.history.replace('/')
        })
    }

    render() {
        let localTime = this.state.localTime;
        const { isLog } = this.state
        return (
            isLog ?
                <div>
                    <AppBar position="static">
                        <div style={styles.header}>
                            <p style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Quiz Questions</p>
                            <Button variant="contained" color="secondary" style={styles.btnLogout} onClick={this.logOut}>
                                <span style={{ color: '#fff', padding: '0' }}>Logout</span>
                            </Button>
                        </div>
                    </AppBar>
                    <div style={{ marginTop: '1%' }}>
                        <List style={{ backgroundColor: '#da8000' }}>
                            <span style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Name : {this.state.quiz.name}</span>
                        </List>
                        <List style={{ backgroundColor: '#da8000' }}>
                            <span style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Duration : {this.state.quiz.Duration}</span>
                        </List>
                        <List style={{ backgroundColor: '#da8000' }}>
                            <span style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Max Marks : {this.state.quiz.maxMarks}</span>
                        </List>
                        <List style={{ backgroundColor: '#da8000' }}>
                            <span style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Time Remaining : </span><Countdown date={parseInt(localTime)} onComplete={() => {
                                localStorage.removeItem('quizIsInUnderWay')
                                localStorage.removeItem('quiz')
                                this.submitQuestion()
                            }} controlled={false} onTick={() => { }} />
                        </List>
                    </div>

                    {this.state.quiz && this.state.quiz.questions.map((q, i) => {
                        return (
                            <div style={{ backgroundColor: '#f1f3f4', padding: 30, marginTop: 10 }}>
                                <div style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'vardana', textAlign: 'left' }}>{"Q" + (i + 1) + ") " + q.question}</div>
                                <div style={{ textAlign: 'left' }}>
                                    <Checkbox
                                        checked={q.index == i && q.option == q.questions.A ? true : false}
                                        onChange={() => this.handleChange(i, q.questions.A)}
                                        value="checkedA"
                                    />
                                    <span>{q.questions.A}</span>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <Checkbox
                                        checked={q.index == i && q.option == q.questions.B ? true : false}
                                        onChange={() => this.handleChange(i, q.questions.B)}
                                        value="checkedB"
                                    />
                                    <span>{q.questions.B}</span>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <Checkbox
                                        checked={q.index == i && q.option == q.questions.C ? true : false}
                                        onChange={() => this.handleChange(i, q.questions.C)}
                                        value="checkedC"
                                    />
                                    <span>{q.questions.C}</span>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <Checkbox
                                        checked={q.index == i && q.option == q.questions.D ? true : false}
                                        onChange={() => this.handleChange(i, q.questions.D)}
                                        value="checkedD"
                                    />
                                    <span>{q.questions.D}</span>
                                </div>

                            </div>


                        )
                    })}
                    <Button style={{ width: 200, height: 50, margin: 30 }} variant="contained" color="secondary" onClick={() => this.submitQuestion()}>
                        Submit
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


export default StartQuiz