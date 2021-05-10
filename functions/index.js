// use firebase serve
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// we need to initialise the admin
admin.initializeApp();

// const express = require("express");
// const app = express();
// can sum the 2 lines into cleaner one liner
const app = require("express")();

const firebaseConfig = {
  apiKey: "AIzaSyCgvCfs3JuWRk5yuz4ODpm9P-89BieOJms",
  authDomain: "mingle-82451.firebaseapp.com",
  projectId: "mingle-82451",
  storageBucket: "mingle-82451.appspot.com",
  messagingSenderId: "919224583217",
  appId: "1:919224583217:web:cc7e37404a29d91675c110",
  measurementId: "G-6CVH9QMZGC",
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

// simplifying normal export function to just app.get
app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      //getting the document reference
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

// exports.createScream = functions.https.onRequest((req, res) => {
//   // added this to ensure if a GET req is sent instead it will not be shown as status 500 internal server error
//   // however, if express is used it takes care of this
//   if (req.method !== "POST") {
//     return res.status(400).json({ error: "Method not allowed" });
//   }
//   const newScream = {
//     body: req.body.body,
//     userHandle: req.body.userHandle,
//     createdAt: admin.firestore.Timestamp.fromDate(new Date()),
//   };

//   admin
//     .firestore()
//     .collection("screams")
//     .add(newScream)
//     .then((doc) => {
//       //getting the document reference
//       res.json({ message: `document ${doc.id} created successfully` });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "something went wrong" });
//       console.error(err);
//     });
// });

// Sign up route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  // TODO: validate data

  // returns a promise
  // when use ` it means we will have variable inside
  // status code 201 means resource created
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signed up successfully` });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

// this allow app to turn into multiple routes
exports.api = functions.region("australia-southeast1").https.onRequest(app);
