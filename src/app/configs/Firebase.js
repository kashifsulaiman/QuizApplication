import firebase from 'firebase'
import swal2 from 'sweetalert';
import History from './history';

require("firebase/firestore");

var config = {
    apiKey: "AIzaSyAH__w-0fB2Upn4Gbc70L9IUJ2g9wUwVtQ",
    authDomain: "expertizoquiz.firebaseapp.com",
    databaseURL: "https://expertizoquiz.firebaseio.com",
    projectId: "expertizoquiz",
    storageBucket: "expertizoquiz.appspot.com",
    messagingSenderId: "378786426812"
};
firebase.initializeApp(config);

//Initialize Firestore
const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const category = () => {
    return new Promise((resolve, reject) => {
        var Category = db.collection('categories').get()
            .then(snapshot => {
                let cat = [];
                snapshot.forEach(function (doc) {
                    let obj = {};
                    if (doc.exists) {

                        obj.id = doc.id;
                        obj.data = doc.data();
                        cat.push(obj);
                    } else {
                        reject(cat)
                    }
                });
                let promises = cat.map(res => {
                    return new Promise((resolve, reject) => {
                        var subCategory = db.collection('categories').doc(res.id).collection("Quizzes").get()
                            .then(snapshot => {
                                let quizzes = [];
                                snapshot.forEach(function (doc) {
                                    let obj = {};
                                    if (doc.exists) {
                                        obj = doc.data();
                                        obj.id = doc.id;
                                        quizzes.push(obj);
                                    }

                                });
                                res.quizzes = quizzes;
                                resolve(res);
                            })
                    });

                });
                resolve(Promise.all(promises));

            });

    })

};



const getCategory = () => {
    return new Promise((resolve, reject) => {
        var users = db.collection('categories').get()
            .then(snapshot => {
                let cat = [];
                snapshot.forEach(function (doc) {
                    let obj = {};
                    if (doc.exists) {
                        obj.id = doc.id;
                        obj.data = doc.data();
                        cat.push(obj);
                    } else {
                        reject(cat)
                    }
                });
                resolve(cat);
            })
    })
};





const googleLogin = () => {
    return new Promise((resolve, reject) => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(function (result) {
                // Accounts successfully linked.
                var credential = result.credential;
                var user = result.user;
            })
    })

        .catch((error) => {
            console.log(error)
        })
}



const facebookLogin = (email, displayName) => {
    return new Promise((resolve, reject) => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var user = result.user;
            db.collection('users').doc(user.uid).set({
                id: user.uid,
                name: user.displayName,
                email: user.email
            })
        })
            .catch(function (error) {
                console.log(error);
                // swal2('Error', error.message, 'error'
                // )
            });
    })
}


const register = ({ firstName, lastName, email, password }) => {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((res) => {
            db.collection('users').doc(res.user.uid).set({
                id: res.user.uid,
                first_name: firstName,
                last_name: lastName,
                email: email.toLowerCase()
            }).then(() => {
                resolve(res);
            })
                .catch((error) => {
                    reject(error);
                    console.log(error);
                });
        }
        ).catch((error) => {
            reject(error.message)
        })
    }
    )
};


const login = ({ email, password }) => {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((res) => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
            });
    })
};



const addCategories = (category, description) => {
    return new Promise((resolve, reject) => {
        db.collection('categories').add({
            name: category,
            createdAt: Date.now(),
            description: description
        })
            .then((res) => {
                resolve(res)
            })
    })
};



const userUpdate = (userId, params) => {
    return db.collection('users').doc(userId).update(params)
};



const userResult = (userId) => {
    return new Promise((resolve, reject) => {
        db.collection('users').doc(userId).get()
            .then((res) => {
                resolve(res.data())
            })
            .catch((err) => {
                reject(err)
            })
    })

};



const getQuizes = (quizId) => {
    return new Promise((resolve, reject) => {
        db.collection('categories').doc(quizId).collection('Quizzes').get()
            .then(snapshot => {
                let quizzes = [];
                snapshot.forEach(doc => {
                    var obj = {};
                    obj.data = doc.data();
                    obj.id = doc.id;
                    quizzes.push(obj)
                });
                resolve(quizzes)
            })
    })
};



const addQuizData = (categoryId, quizMark, quizName, quizDuration, quizPassword) => {
    return new Promise((resolve, reject) => {
        db.collection('categories').doc(categoryId).collection('Quizzes').add({
            Duration: quizDuration,
            maxMarks: quizMark,
            name: quizName,
            password: quizPassword,
            createdAt: Date.now()
        }).then((res) => {
            resolve(res)
        })
    })
};



const getQuizQuestion = (categoryId, quizId) => {
    return new Promise((resolve, reject) => {
        db.collection('categories').doc(categoryId).collection('Quizzes').doc(quizId).get()
            .then((res) => {
                resolve(res.data())
            })
    })
};


const addQuestion = (allQuestion, categoryId, quizId) => {
    return new Promise((resolve, reject) => {
        db.collection('categories').doc(categoryId).collection('Quizzes').doc(quizId).update({
            questions: allQuestion
        })
        resolve();
    })
};



export {
    firebase,
    category,
    register,
    login,
    addCategories,
    getQuizes,
    addQuizData,
    getCategory,
    getQuizQuestion,
    addQuestion,
    userUpdate,
    userResult,
    googleLogin,
    facebookLogin
}