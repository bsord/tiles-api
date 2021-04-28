let mongoose = require('mongoose')
let timestamps = require('mongoose-timestamp');
let mongooseStringQuery = require('mongoose-string-query');
let bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    picture: String,
    admin: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        select: false
    },
    authProviders: {
        github: { type: Boolean, default: false },
        google: { type: Boolean, default: false }
    },
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    },
    githubProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
});

// Encrypt the password before storing.
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// Verify password by decrypting it.
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// Configure plugins
UserSchema.plugin(timestamps); // Automatically adds createdAt and updatedAt timestamps
UserSchema.plugin(mongooseStringQuery); // Enables query capabilities (e.g. ?foo=bar)

UserSchema.statics.upsertGoogleUser = function (accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
        'googleProvider.id': profile.id
    }, function (err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new that({
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.emails[0].value,
                picture: profile._json.picture,
                password: "",
                authProviders: {
                    github: false,
                    google: true
                },
                googleProvider: {
                    id: profile.id,
                    token: accessToken,
                    profile: profile
                },
                emailVerified: true,
            });

            newUser.save(function (error, savedUser) {
                if (error) {
                    //error
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};

UserSchema.statics.upsertGithubUser = function (accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
        'githubProvider.id': profile.id
    }, function (err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new that({
                name: profile.displayName ? profile.displayName : profile.username,
                email: profile.emails[0].value,
                username: profile.emails[0].value,
                picture: profile._json.avatar_url,
                password: "",
                authProviders: {
                    github: true,
                    google: false
                },
                githubProvider: {
                    id: profile.id,
                    token: accessToken,
                    profile: profile
                },
                emailVerified: true,
            });

            newUser.save(function (error, savedUser) {
                if (error) {
                    //error
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};

module.exports = mongoose.model('User', UserSchema)