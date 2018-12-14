import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { getQuizQuestion, addQuestion } from './../../../configs/Firebase'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconAdd from '../../AddIcon/Icon';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Custom from './style.css';

export default class QuestionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quizName: '',
            quizId: '',
            categoryId: '',
            quizQusetion: [],
            open: false,
            question: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctOption: ''
        }
        this.addnewQuestion = this.addnewQuestion.bind(this);
        this.getQuiz = this.getQuiz.bind(this);
    }

    componentWillMount() {
        this.setState({ quizName: this.props.location.state.quiz, quizId: this.props.location.state.quizId, categoryId: this.props.location.state.categoryId })
        this.getQuiz()
    }

    async getQuiz() {
        const categoryId = this.props.location.state.categoryId;
        const quizId = this.props.location.state.quizId;
        const quizQuestion = await getQuizQuestion(categoryId, quizId);
        this.setState({ quizQusetion: quizQuestion.questions })
    }

    async addnewQuestion() {
        const { quizId, categoryId, question, optionA, optionB, optionC, optionD, correctOption, quizQusetion } = this.state
        var allQuestion = [];
        let newQuestion = {};
        allQuestion = quizQusetion || [];
        newQuestion.correct_answer = correctOption;
        newQuestion.question = question;
        newQuestion.questions = { A: optionA, B: optionB, C: optionC, D: optionD };
        allQuestion.push(newQuestion);
        await addQuestion(allQuestion, categoryId, quizId)
        this.setState({ open: false, question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: '', quizQusetion: allQuestion }, () => this.getQuiz())
        alert(' New Question Added ')

    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };


    render() {
        let { quizId, categoryId, question, optionA, optionB, optionC, optionD, correctOption, quizQusetion } = this.state

        return (
            <div>
                <AppBar position="static">
                    <p>{this.state.quizName}</p>
                </AppBar>

                <div >
                    {this.state.quizQusetion && this.state.quizQusetion.map((el, i) => {
                        return (
                            <div style={{ backgroundColor: '#e0e0e0', marginTop: '5%', height: '300px' }}>
                                <div className="renderQuestions">
                                    <List component="nav">
                                        <ListItem >
                                            <h3>{i + 1}: {el.question}</h3>
                                        </ListItem>
                                    </List>

                                    <div >
                                        <Button variant="contained" color={el.questions.A === el.correct_answer ? "primary" : "default"} className="options">
                                            {el.questions.A}
                                        </Button>
                                        <Button variant="contained" color={el.questions.B === el.correct_answer ? "primary" : "default"} className="options">
                                            {el.questions.B}
                                        </Button>
                                        <Button variant="contained" color={el.questions.C === el.correct_answer ? "primary" : "default"} className="options">
                                            {el.questions.C}
                                        </Button>
                                        <Button variant="contained" color={el.questions.D === el.correct_answer ? "primary" : "default"} className="options">
                                            {el.questions.D}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        )
                    })
                    }
                </div>
                <div onClick={this.handleClickOpen}>
                    <IconAdd />
                </div>

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add new question</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Write Question"
                            value={this.state.question}
                            onChange={(event) => { this.setState({ question: event.target.value }) }}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            label="Write Option: A"
                            value={this.state.optionA}
                            onChange={(event) => { this.setState({ optionA: event.target.value }) }}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            label="Write Option: B"
                            value={this.state.optionB}
                            onChange={(event) => { this.setState({ optionB: event.target.value }) }}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            label="Write Option: C"
                            value={this.state.optionC}
                            onChange={(event) => { this.setState({ optionC: event.target.value }) }}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            label="Write Option: D"
                            value={this.state.optionD}
                            onChange={(event) => { this.setState({ optionD: event.target.value }) }}
                        />
                    </DialogContent>
                    <DialogContent>
                        {/* <TextField
                            label="Write Correct Option"
                            value={this.state.correctOption}
                        onChange={(event) => { this.setState({ correctOption: event.target.value }) }}
                        /> */}
                        <InputLabel htmlFor="age-helper">Select Correct Option</InputLabel>
                        <Select
                            onChange={(event) => { this.setState({ correctOption: event.target.value }) }}
                            value={correctOption}
                        // onChange={this.handleChange}
                        // input={<Input name="age" id="age-helper" value={this.state.correctOption} />}
                        >
                            <MenuItem value={optionA}>A</MenuItem>
                            <MenuItem value={optionB}>B</MenuItem>
                            <MenuItem value={optionC}>C</MenuItem>
                            <MenuItem value={optionD}>D</MenuItem>
                        </Select>
                        {/* <FormHelperText>Some important helper text</FormHelperText> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                     </Button>
                        <Button onClick={() => this.addnewQuestion()} color="primary">
                            Create
                     </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}