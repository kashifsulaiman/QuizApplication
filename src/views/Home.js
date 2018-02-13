import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import Quiz from '../components/Quiz'

export default class Home extends Component<Props> {
    constructor(props){
        super(props);

        this.state = {
            quizzes: [],
            correct: 0,
            currentQuiz: null
        };

        this.getQuiz();
    }

    getQuiz() {
        fetch('https://opentdb.com/api.php?amount=10').then((res) => res.json()).then((resp) => {
            this.setState({quizzes: resp.results});
        }).catch(() => {
            this.setState({quizzes: []})
        })
    }

    renderEnd() {
        const {correct, quizzes} = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Thanks for the quiz
                </Text>
                <Text style={styles.welcome}>
                    You've scored {correct / quizzes.length * 100} %
                </Text>
                <Button
                    disabled={!quizzes.length}
                    onPress = {() => this.setState({currentQuiz: 1, correct: 0})}
                    title="Play again"
                    color="#841584"
                />
            </View>
        )
    }


    onAnswer(isCorrect){
        const {currentQuiz, correct} = this.state;
        this.setState({correct: isCorrect ? (correct + 1) : correct, currentQuiz: currentQuiz + 1});
    }

    render() {
        const {currentQuiz, quizzes} = this.state;
        return (
            <View>
                {currentQuiz ?
                    currentQuiz == quizzes.length
                        ?
                        this.renderEnd()
                        :
                        <Quiz quiz={quizzes[currentQuiz - 1]} number={currentQuiz} onSubmit={this.onAnswer.bind(this)}/>
                    :
                    <View style={styles.container}>
                        <Text style={styles.welcome}>
                            Welcome to Quiz App!
                        </Text>
                        <Button
                            disabled={!quizzes.length}
                            onPress = {() => this.setState({currentQuiz: 1})}
                            title="Start Quiz"
                            color="#841584"
                        />
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
