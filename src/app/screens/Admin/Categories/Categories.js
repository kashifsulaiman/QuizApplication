import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { addCategories, getCategory, firebase } from './../../../configs/Firebase'
import swal from 'sweetalert';
import Loader from '../../Loader/Loader';
import IconAdd from '../../AddIcon/Icon';


export default class CreateCategories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            category: '',
            description: '',
            open: false,
            categories: [],
            isLoad: true,
        };
        this.getData = this.getData.bind(this);
        this.addCategory = this.addCategory.bind(this);
    }

    componentWillMount() {
        this.getData()
    }

    componentDidMount = async () => {
        await this.checkAuth()
    }

    checkAuth = () => {
        let { isLoad } = this.state;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {

                firebase.firestore().collection('users').doc(user.uid).get()
                    .then((item) => {
                        if (item.data().isAdmin) {
                            this.props.history.push('/CreateCategories')
                            this.setState({ isLoad: false })
                        }
                        else {
                            this.setState({ isLoad: false })
                            this.props.history.push('Categories')
                        }
                    })

            }
            else {
                this.setState({ notLog: true })
                this.props.history.push('/')

            }
        });
    }


    logOut = () => {
        firebase.auth().signOut().then(() => {
            this.props.history.replace('/')
        })
    }

    async getData() {
        let res = await getCategory();
        this.setState({ categories: res })
    }

    async addCategory() {
        const { category, description } = this.state;
        const categoryRes = await addCategories(category, description);
        swal(
            'Added!', 'New category created successfully', 'info'
        )
        this.getData();
        this.setState({ open: false, category: '', description: '', })
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        let { isLoad } = this.state;
        return (
            !isLoad ?
                <div>
                    <AppBar position="static">
                        <p>Create category</p>
                        <Button variant="contained" color="secondary" style={styles.btnLogout} onClick={this.logOut}>
                            <span style={{ color: '#fff', padding: '0' }}>Logout</span>
                        </Button>
                    </AppBar>
                    <div style={{ position: 'absolute' }}>
                        {this.state.categories.map((el) => {
                            return (
                                <List component="nav" onClick={() => this.props.history.push('/Quiz', { category: el.data.name, categoryId: el.id })}>
                                    <ListItem button>
                                        <ListItemText>{el.data.name}</ListItemText>
                                    </ListItem>
                                </List>
                            )
                        })}
                    </div>
                    <div className="addicon">
                        <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleClickOpen}>
                            <IconAdd />
                        </Button>
                    </div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">Add new category</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Category Name"
                                value={this.state.category}
                                onChange={(event) => { this.setState({ category: event.target.value }) }}
                            />
                        </DialogContent>
                        <DialogContent>
                            <TextField
                                label="Category Description"
                                value={this.state.description}
                                multiLine={true}
                                rows={2}
                                onChange={(event) => { this.setState({ description: event.target.value }) }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                        </Button>
                            <Button onClick={() => this.addCategory()} color="primary">
                                Create
                        </Button>
                        </DialogActions>
                    </Dialog>
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