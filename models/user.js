const mongoose = require('mongoose')
const crypto = require('crypto')
const {
    v4: uuidv4
} = require('uuid')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        maxlength: 32
    },
    lastname: {
        type: String,
        trim: true,
        maxlength: 32
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        require: true
    },
    slat: String,
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
        this.slat = uuidv4()
        this.encry_password = this.securePassword(password)
    })
    .get(function () {
        return this._password;
    })

// method on schema for hashing password

userSchema.method = {
    authentication: function (plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password
    },
    securePassword: function (plainpassword) {
        if (!plainpassword) {
            return ""
        }
        try {
            return crypto.createHmac('sha256', this.slat)
                .update(plainpassword)
                .digest('hex');
        } catch (err) {
            return ""
        }
    }
}

module.export = mongoose.model('User', userSchema);