const express = require('express')
    , app = express()
    , passport = require('passport')
    , session = require('express-session')
    , OneIDStrategy = require('passport-oneid-inet').Strategy;

let users = []

passport.serializeUser((user, done) => {
    users.push(user)
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    done(null, users.find(user => user.id == id))
})

passport.use(new OneIDStrategy({
    clientId: 'xx',
    clientSecret: 'xxx',
    refCode: 'xxx'
}))

app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true,
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', ensureAuthenticated, function (req, res) {
    res.send('OK')
})

app.get('/auth/oneid',
    passport.authenticate('oneid'),
    function (req, res) {
        res.redirect('/')
    }
)

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/auth/oneid')
}

app.listen(3000)