

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('./dataBaseConfig');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  console.log(profile)
  try {

    let sql = 'SELECT * FROM clientdata WHERE googleId = ?';
    db.query(sql, [profile.id], (err, rows) => {
      if (err) return done(err);
      if (rows.length) {
        const user = rows[0];
        return done(null, {
          id: user.id,
          username: user.username,
          email: user.email,
          image: user.image,
        });
      } else {
        const newUser = {
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,

        };

        sql = 'INSERT INTO clientdata SET ?';
        db.query(sql, newUser, (err, result) => {
          if (err) return done(err);
          newUser.id = result.insertId;
          done(null, {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            image: newUser.image,
          });
        });
      }
    });
  } catch (err) {
    console.error(err);
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  let sql = 'SELECT * FROM clientdata WHERE id = ?';
  db.query(sql, [id], (err, rows) => {
    if (err) return done(err);
    const user = rows[0];
    done(null, {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
    });
  });
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:5173/${token}`);
  }
);


router.get('/verify', (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  console.log(token)
  if (!token) {
    return res.status(401).send('Token is missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    res.status(200).send(decoded);
  } catch (err) {
    res.status(401).send('Invalid token');
  }
});

module.exports = router;