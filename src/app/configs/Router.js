import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Categories from '../../app/screens/Categories/Categories';
import Signup from '../../app/screens/Register/Signup'
import Login from '../../app/screens/Login/Login'
import StartQuiz from '../screens/QuizStarting/StartQuiz'
import Result from '../screens/QuizStarting/Result'
import QuizScreen from './../../app/screens/Admin/CreateQuiz/Quiz'
import CreateCategories from './../../app/screens/Admin/Categories/Categories'
import QuestionScreen from './../screens/Admin/QuizQuestion/Question'

export const Routing = () => (
    <Router>
        <div>

            <Route exact path="/" component={Login} />
            <Route exact path="/Categories" component={Categories} />
            <Route exact path="/Signup" component={Signup} />
            <Route exact path="/QuizStarting" component={StartQuiz} />
            <Route exact path="/Result" component={Result} />
            <Route exact path="/CreateCategories" component={CreateCategories} />
            <Route exact path="/Question" component={QuestionScreen} />
            <Route exact path="/Quiz" component={QuizScreen} />
        </div>
    </Router>
);





export default Routing;
