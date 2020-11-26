const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

const express = require('express');

const app = express();

exports.hi = functions.https.onRequest((req, res) => {
    res.send("HI!!!!");
});

app.get('/posts', (req, res) => {
    admin.firestore().collection('posts').get()
        .then(data => {
            var posts = [];
            data.forEach(doc => {
                posts.push({
                    postID: doc.id,
                    body: doc.data().body,
                    memberHandle: doc.data().memberHandle,
                    createdOn: doc.data().createdOn
                });
            });
            return res.json(posts);
        })
        .catch(err => console.error(err))
});

app.post('/post', (req, res) => {
    const newPost = {
        body: req.body.body,
        memberHandle: req.body.memberHandle,
        createdOn: new Date().toISOString()
    }

    admin.firestore()
        .collection('posts').add(newPost)
        .then(doc => {
            return res.json({ message: `Document ${doc.id} created successfully!` });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: "Oops, there was an error." });
        });
});

exports.api = functions.https.onRequest(app);