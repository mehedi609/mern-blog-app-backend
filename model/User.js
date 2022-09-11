const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const { generateToken } = require('../utils');
const mongooseHidden = require('mongoose-hidden')();

//create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, 'First name is required'],
      type: String,
    },
    lastName: {
      required: [true, 'Last name is required'],
      type: String,
    },
    profilePhoto: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Hei buddy Password is required'],
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Guest', 'Blogger'],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isUnFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  },
);

//virtual method to populate created post
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});

// Hash password
userSchema.pre('save', async function (next) {
  //hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// generate token to verify account
userSchema.methods.createAccountVerificationToken = async function (id) {
  //create a token
  /*const verificationToken = crypto.randomBytes(32).toString('hex');
  this.accountVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; //10 minutes*/
  const verificationToken = generateToken(id, '10min');
  this.accountVerificationToken = verificationToken;
  this.accountVerificationTokenExpires = dayjs().add(10, 'minute');
  return verificationToken;
};

// generate password reset token
userSchema.methods.createPasswordResetToken = async function (id) {
  //create a token
  const verificationToken = generateToken(id, '10min');
  this.passwordResetToken = verificationToken;
  this.passwordResetExpires = dayjs().add(10, 'minute');
  return verificationToken;
};

userSchema.plugin(mongooseHidden);

//Compile schema into model
const User = mongoose.model('User', userSchema);

module.exports = User;
