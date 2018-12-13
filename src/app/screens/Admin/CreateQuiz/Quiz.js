import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { getQuizes, addQuizData } from './../../../configs/Firebase'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconAdd from '../../AddIcon/Icon';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import swal from 'sweetalert'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


export default class QuizScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryName: '',
            categoryId: '',
            quizzes: [],
            quizName: '',
            quizDuration: '',
            quizPassword: '',
            quizMark: '',
            open: false,
            visibility: false,
        }
        this.getQuiz = this.getQuiz.bind(this);
        this.addQuiz = this.addQuiz.bind(this);
    }

    componentWillMount() {
        this.setState({ categoryName: this.props.location.state.category, categoryId: this.props.location.state.categoryId })
        this.getQuiz()
    }

    async getQuiz() {
        const quizId = this.props.location.state.categoryId
        const quizes = await getQuizes(quizId);
        this.setState({ quizzes: quizes })
    }
    async addQuiz() {
        const { categoryId, quizName, quizDuration, quizPassword, quizMark } = this.state;
        await addQuizData(categoryId, quizMark, quizName, quizDuration, quizPassword)
        this.getQuiz();
        this.setState({ quizName: '', quizDuration: '', quizPassword: '', quizMark: '', open: false }, () => { alert('New QuizStarting Added Successfully') })

    }
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };



    // toggle function for show and hide password
    tooglePasswordForTrue() {
        let { visibility } = this.state;
        this.setState({
            visibility: true
        })
    }

    tooglePasswordForFalse() {
        let { visibility } = this.state;
        this.setState({
            visibility: false
        })
    }

    render() {
        let { visibility } = this.state;

        return (
            <div>
                <AppBar position="static">
                    <p>{this.state.categoryName}</p>
                </AppBar>
                <div >
                    {this.state.quizzes.map((el) => {
                        return (
                            <List component="nav" onClick={() => this.props.history.push('/Question', { quiz: el.data.name, quizId: el.id, categoryId: this.state.categoryId })}>
                                <ListItem button>
                                    <ListItemText>{el.data.name}</ListItemText>
                                </ListItem>
                            </List>
                        )
                    })}
                </div>
                <div onClick={this.handleClickOpen}>
                    <IconAdd />
                </div>

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add new Quiz</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Quiz Name"
                            value={this.state.quizName}
                            onChange={(event) => { this.setState({ quizName: event.target.value }) }}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            label="Quiz Duration (Min)"
                            value={this.state.quizDuration}
                            onChange={(event) => {
                                if ((event.target.value).match(/^(\s*|\d+)$/)) {
                                    this.setState({ quizDuration: event.target.value })
                                }
                                else {
                                    swal(
                                        'Warning!!', 'Enter Time in Minutes by using numbers only', 'info'
                                    )

                                }
                            }
                            }
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            label="Quiz Password"
                            type={visibility ? 'text' : 'password'}
                            value={this.state.quizPassword}
                            onChange={(event) => { this.setState({ quizPassword: event.target.value }) }}
                        />
                        <div style={{ display: 'inline' }}>
                            {
                                visibility ?
                                    <VisibilityOff onClick={this.tooglePasswordForFalse.bind(this)} style={{ marginLeft: '-13px', cursor: 'pointer' }} />
                                    :
                                    <Visibility onClick={this.tooglePasswordForTrue.bind(this)} style={{ marginLeft: '-13px', cursor: 'pointer' }} />
                            }
                        </div>
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            label="Quiz Marks"
                            value={this.state.quizMark}
                            onChange={(event) => { this.setState({ quizMark: event.target.value }) }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.addQuiz()} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}