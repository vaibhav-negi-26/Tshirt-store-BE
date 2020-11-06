const mongoose = require('mongoose')
const crypto = require('crypto')
const {
    v4: uuidv4
} = require('uuid')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    last_name: {
        type: String,
        trim: true,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    user_info: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})


// virtual property password
// key with a '_' in their start are private property

userSchema.virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = uuidv4()
        this.encry_password = this.securePassword(password)
    })
    .get(function () {
        return this._password;
    })

// method on schema for hashing password

userSchema.methods = {
    authentication: function (plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password
    },
    securePassword: function (plainpassword) {
        if (!plainpassword) {
            return ""
        }
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainpassword)
                .digest('hex');
        } catch (err) {
            return ""
        }
    }
}

module.exports = mongoose.model('User', userSchema)