const mongoose = require('mongoose');
const { commentSchema } = require('./comment');

const perfumeSchema = new mongoose.Schema(
  {
    perfumeName: { type: String, require: true },
    uri: { type: String, require: true },
    price: { type: Number, require: true },
    concentration: { type: String, require: true }, // nồng độ của nước hoa: Extrait, EDP, EDT,…
    description: { type: String, require: true },
    ingredients: { type: String, require: true },
    volume: { type: Number, require: true },
    targetAudience: { type: String, require: true }, // male, femail, unisex
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      require: true,
    },
  },
  { timestamps: true }
);

const Perfume = mongoose.model('Perfume', perfumeSchema);

module.exports = Perfume;
