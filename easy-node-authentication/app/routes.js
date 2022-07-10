module.exports = function(app, passport) {
    // homepage
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // profile
    // must logged in to protect user
    // use middleware (isLoggedIn) to verify
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // login
    app.get('/login', function(req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // signup
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to signup page if error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    /* authorize (connecting other sns account) */
    // local
    app.get('/connect/local', function(req, res) {
        res.render('connect-local-ejs', {message: req.flash('loginMessage')});
    });

    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/connect/local',
        failureFlash: true
    }));

    /* --------------- GOOGLE ROUTES -------------- */
    app.get('/auth/google', //'/auth/google'
        passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback', //'/auth/google/callback'
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // google
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));
    app.get('/connect/google/callback',
    passport.authorize('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    /* unlink account */
    // for social accounts, just remove the token
    // for local account, remove email and password
    
    // local
    app.get('/unlink/local', function(req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.safe(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});
};

// middleware to verify user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}