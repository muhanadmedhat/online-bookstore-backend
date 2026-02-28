const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      default: ''
    },
    authorImage: {
      type: String,
      required: true
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('Author', authorSchema);
