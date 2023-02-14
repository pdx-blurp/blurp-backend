const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    let token = req.body.token;

    console.log(token);
    async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    console.log(payload)
    }
    verify()
    .then(() => {
        res.cookie('session-token', token);
        res.send('success');
    }).catch(console.error);
});

router.get('/profile', checkAuthenticated, (req, res) => {
    let user = req.user;
    res.render('profile', {user});
})

router.get('/protectedroute', checkAuthenticated, (req, res) => {
    res.render('protectedroute')
})

router.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    let token = req.cookies('session-token');

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, // specify the CLIENT_ID token of the app that acesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
    .then(()=> {
        req.user = user;
        next();
    })
    .catch(err => {
        res.redirect('/login');
    })
}

module.exports = router;