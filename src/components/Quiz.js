import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons';

export default class Quiz extends Component<Props> {
    constructor(props){
        super(props);

        this.state = {
            quizzes: [],
            selected : '',
            options: []
        };

        this.submit.bind(this);
    }

    componentWillMount(){
        this.collectOptions();
    }

    componentDidUpdate(props){
        if(this.props.number != props.number){
            this.setState({selected: ''})
            this.collectOptions();
        }
    }

    collectOptions() {
        const {quiz} = this.props;

        var options = JSON.parse(JSON.stringify(quiz.incorrect_answers));
        options.push(quiz.correct_answer);
        this.setState({options});
    }

    submit() {
        const {quiz, number} = this.props;
        const {selected} = this.state;

        this.props.onSubmit(quiz.correct_answer == selected);
    }


    render() {
        const {quiz, number} = this.props;
        const {options, selected} = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Question # {number}
                </Text>
                <Text>
                    {quiz.question}
                </Text>

                <RadioButtons
                    options={options}
                    onSelection={ (toSelect) => {this.setState({selected: toSelect})} }
                    selectedOption={selected}
                />

                <Button
                    onPress={this.submit.bind(this)}
                    disabled={!selected}
                    title="Submit"
                    color="#841584"
                />
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
