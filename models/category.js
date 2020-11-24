const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 1,
      maxlength: 32,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Category", categorySchema)
