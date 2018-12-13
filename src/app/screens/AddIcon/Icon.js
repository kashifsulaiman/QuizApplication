import React, { Component } from 'react';
// import './App.css';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import style from './style.css';



class IconAdd extends Component {
    render() {
        return (
            <div className="addicon">
                <Button variant="fab" color="primary" aria-label="Add" >
                    <AddIcon />
                </Button>
            </div>
        );
    }
}

export default IconAdd;
