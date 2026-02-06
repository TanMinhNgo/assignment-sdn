var express = require('express');
var router = express.Router();
const Perfume = require('../models/perfume');
const Brand = require('../models/brand');

/* GET home page - display all perfumes with search and filter */
router.get('/', async function (req, res, next) {
  try {
    const { search, brand } = req.query;
    let query = {};

    // Search by perfume name
    if (search) {
      query.perfumeName = { $regex: search, $options: 'i' };
    }

    // Filter by brand
    if (brand) {
      const brandDoc = await Brand.findOne({
        brandName: { $regex: brand, $options: 'i' },
      });
      if (brandDoc) {
        query.brand = brandDoc._id;
      }
    }

    const perfumes = await Perfume.find(query)
      .populate('brand', 'brandName')
      .sort({ createdAt: -1 });

    const brands = await Brand.find().sort({ brandName: 1 });

    res.render('index', {
      title: 'Perfume Collection',
      perfumes,
      brands,
      search: search || '',
      selectedBrand: brand || '',
      user: req.user || null,
    });
  } catch (error) {
    next(error);
  }
});

/* GET perfume detail page */
router.get('/perfumes/:id', async function (req, res, next) {
  try {
    const perfume = await Perfume.findById(req.params.id)
      .populate('brand', 'brandName')
      .populate('comments.author', 'membername email');

    if (!perfume) {
      return res
        .status(404)
        .render('error', { message: 'Perfume not found', error: {} });
    }

    res.render('perfume-detail', {
      title: perfume.perfumeName,
      perfume,
      user: req.user || null,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
