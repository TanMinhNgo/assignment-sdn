const Perfume = require('../models/perfume');
const Brand = require('../models/brand');

const getAllPerfumes = async (req, res) => {
  try {
    const { search, brand } = req.query;
    let query = {};

    if (search) {
      query.perfumeName = { $regex: search, $options: 'i' };
    }

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
      .populate('comments.author', 'membername')
      .sort({ createdAt: -1 });

    res.json(perfumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPerfumeById = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.perfumeId)
      .populate('brand', 'brandName')
      .populate('comments.author', 'membername email');

    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }

    res.json(perfume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPerfume = async (req, res) => {
  try {
    const {
      perfumeName,
      uri,
      price,
      concentration,
      description,
      ingredients,
      volume,
      targetAudience,
      brand,
    } = req.body;

    // Validate brand exists
    const brandDoc = await Brand.findById(brand);
    if (!brandDoc) {
      return res.status(400).json({ message: 'Invalid brand ID' });
    }

    const perfume = new Perfume({
      perfumeName,
      uri,
      price,
      concentration,
      description,
      ingredients,
      volume,
      targetAudience,
      brand,
      comments: [],
    });

    const savedPerfume = await perfume.save();
    const populatedPerfume = await Perfume.findById(savedPerfume._id).populate(
      'brand',
      'brandName'
    );

    res.status(201).json(populatedPerfume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePerfume = async (req, res) => {
  try {
    const { brand, ...updateData } = req.body;

    if (brand) {
      const brandDoc = await Brand.findById(brand);
      if (!brandDoc) {
        return res.status(400).json({ message: 'Invalid brand ID' });
      }
      updateData.brand = brand;
    }

    const perfume = await Perfume.findByIdAndUpdate(
      req.params.perfumeId,
      updateData,
      { new: true, runValidators: true }
    ).populate('brand', 'brandName');

    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }

    res.json(perfume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findByIdAndDelete(req.params.perfumeId);

    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }

    res.json({ message: 'Perfume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
};
