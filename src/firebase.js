import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyB4wv_0r72xTVJaZMns9T2L-cnMRoy4Dw0",
    authDomain: "abony-price-directory.firebaseapp.com",
    databaseURL: "https://abony-price-directory.firebaseio.com",
    projectId: "abony-price-directory",
    storageBucket: "abony-price-directory.appspot.com",
    messagingSenderId: "193713946080",
    appId: "1:193713946080:web:e5ebfebea8edda8546ff85",
    measurementId: "G-DCJEB19YVX"
};

firebase.initializeApp(config)

export default firebase