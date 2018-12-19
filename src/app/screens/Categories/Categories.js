import React, { Component } from "react";
import { category, firebase, userResult } from '../../configs/Firebase'
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListSubheader from '@material-ui/core/ListSubheader';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import StarBorder from '@material-ui/icons/StarBorder';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Loader from '../Loader/Loader';
import swal from 'sweetalert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip'

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: [],
            search: '',
            searchArr: [],
            open: false,
            openDialog: false,
            currentIndex: [],
            quizPassword: '',
            enterPassword: '',
            quiz: [],
            isLog: false,
            catLoad: false,
            test: ''
        };
        this.checkForAuth(props, this.state)
    }



    componentWillMount() {
        this.checkForAuth()
        this.getData();
    }

    checkForAuth = () => {
        if (JSON.parse(localStorage.getItem('quizIsInUnderWay'))) {
            return this.props.history.replace('/QuizStarting')
        }
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.props.history.replace('/')
            } else {
                this.setState({ isLog: true })
            }
        });
    }


    async getData() {
        this.setState({ catLoad: true })
        let res = await category();
        this.setState({ category: res, catLoad: false })
    }

    async checkResult(quiz, category, startTime, data) {
        var user = firebase.auth().currentUser;
        if (user) {
            const res = await userResult(user.uid);
            //let result = this.checkResult();
            if (res.result) {
                let testResult = res.result
                let quizName = quiz.name
                let flag = false
                for (var key in testResult) {
                    if ((category + ' | ' + quizName) == key) {
                        var res = testResult[key]
                        this.setState({ [quizName]: [res] })
                        flag = true
                        swal('Sorry', 'You can not attempt this Quiz again', 'info')
                    }
                }
                if (!flag) {
                    this.handleClickOpen(quiz, category, startTime, data)
                }
            }
            else {

                this.handleClickOpen(quiz, category, startTime, data)
            }
        }
    }

    handleClickOpen = (quiz, category, startTime, data) => {

        if (quiz.startTime) {
            if (Date.now() >= quiz.startTime) {
                if (Date.now() > quiz.endTime) {
                    swal(
                        'Sorry!', 'You are Late! This Quiz has Expired!', 'error'
                    )
                }
                else {
                    quiz.category = category;
                    this.setState({ time: (quiz.startTime + ((parseInt(parseInt(quiz.Duration) * 60000)))), openDialog: true, quizPassword: quiz.password, quiz: quiz, quizName: quiz.name });
                }
            }
            else {
                swal('Sorry!', 'This Quiz is Time Specific You cannot start this quiz at this time try again', 'error')
            }
        }
        else {
            quiz.category = category;
            this.setState({ time: (Date.now() + ((parseInt(parseInt(quiz.Duration) * 60000)))), openDialog: true, quizPassword: quiz.password, quiz: quiz, quizName: quiz.name });
        }

    };

    handleClose = () => {
        this.setState({ openDialog: false });
    };


    handleClick = (i, data) => {
        this.setState(({ open: !this.state.open }));
        let addKey = this.state.category;
        addKey[i].index = i;
        this.setState({ category: addKey, currentIndex: i });
    };

    checkSearch(e) {
        this.setState({ search: e.target.value });
        let filterText = this.state.category.filter((el) => {
            return el.data.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        });
        this.setState({ searchArr: filterText })
    }
    matchPassword(data) {
        if (this.state.enterPassword === this.state.quizPassword) {
            if (!localStorage.getItem(('localTime' + this.state.quizName))) {
                localStorage.setItem(('localTime' + this.state.quizName), this.state.time);
            }
            //localStorage.removeItem('localTime' + this.state.quizName);
            localStorage.setItem('quiz', JSON.stringify(this.state.quiz))
            this.props.history.push('/QuizStarting', { quiz: this.state.quiz })
        }
        else {
            swal('Error', 'Invalid Password', 'error'
            )
        }
    }

    logOut = () => {
        firebase.auth().signOut().then(() => {
            this.props.history.replace('/')
        })
    }
    
    render() {
        const { isLog, catLoad } = this.state
        return (
            isLog ?
                <div style={{ height: '100vh' }}>
                    <AppBar position="static">
                        <div style={styles.header}>
                            <p style={{ color: 'white' }}>Quiz Categories</p>
                            <Button variant="contained" color="secondary" style={styles.btnLogout} onClick={this.logOut}>
                                <span style={{ color: '#fff', padding: '0' }}>Logout</span>
                            </Button>
                        </div>

                    </AppBar>



                    <TextField
                        label="Search Quizzes..."
                        value={this.state.search}
                        onChange={(e) => this.checkSearch(e)}
                        margin="normal"
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {
                            !catLoad
                                ?
                                this.state[this.state.search ? 'searchArr' : 'category'].map((el, index) => {
                                    return (

                                        <List style={{ width: '45%', height: '10%', marginTop: '2%', marginLeft: '3.5%', borderRadius: 10, backgroundColor: '#402501' }}>
                                            <ListItem button onClick={() => this.handleClick(index)}>
                                                <ListItemText style={{ textTransform: 'capitalize' }}><span style={{ color: 'white' }}>{el.data.name}</span></ListItemText>
                                                {this.state.open && el.index === this.state.currentIndex ? <ExpandMore /> : <ExpandLess />}
                                            </ListItem>
                                            {el.index === this.state.currentIndex && <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding    >
                                                    {
                                                        el.quizzes.map((quiz) => {
                                                            //this.previousResult(quiz)
                                                            return (
                                                                <Tooltip title={`Duration: ${quiz.Duration} Mins ||
                                                                                          Total Questions: ${quiz.questions ? quiz.questions.length : 0} ||
                                                                                         Passing Marks: 50%`}>
                                                                    <ListItem style={{ backgroundColor: '#da8000', cursor: 'default', width: '95%', marginLeft: '2.5%', marginBottom: '2.5%', borderRadius: 10 }} button>
                                                                        <ListItemText>
                                                                            <span style={{ color: 'white' }}>{quiz.name}</span>
                                                                            <Button variant="contained" color="primary" style={styles.btnLogout} onClick={() => { this.checkResult(quiz, el.data.name, el.data.startTime, el.data) }}>
                                                                                <span style={{ color: ((this.state[`${quiz.name}`]) ? ((this.state[`${quiz.name}`]) < 50 ? 'red' : (this.state[`${quiz.name}`]) < 80 ? 'yellow' : 'green') : 'white'), padding: '0' }}>{this.state[`${quiz.name}`] ? ((parseInt(this.state[`${quiz.name}`])).toFixed(2) + '%') : "Take Quiz"}</span>
                                                                            </Button>
                                                                        </ListItemText>
                                                                    </ListItem>
                                                                </Tooltip>
                                                            )
                                                        })
                                                    }
                                                </List>
                                            </Collapse>}
                                            {this.state.openDialog && <Dialog
                                                open={this.state.open}
                                                onClose={this.handleClose}
                                                aria-labelledby="form-dialog-title"
                                            >
                                                <DialogTitle id="form-dialog-title">Enter Quiz Password</DialogTitle>
                                                <DialogContent>
                                                    <TextField
                                                        label="Password"
                                                        type="password"
                                                        value={this.state.enterPassword}
                                                        onChange={(event) => { this.setState({ enterPassword: event.target.value }) }}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={this.handleClose} color="primary">
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={() => this.matchPassword(el)} color="primary">
                                                        Submit
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>}
                                        </List>
                                    )
                                })
                                :
                                <Loader style={{ alignSelf: 'center' }} />
                        }
                    </div>

                </div>
                :
                <Loader />
        );
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


export default Categories;
