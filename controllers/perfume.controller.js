const Perfume = require('../models/perfume');
const Brand = require('../models/brand');

const getPerfumes = async (req, res) => {
  try {
    const perfumes = await Perfume.find()
      .populate('brand', 'brandName')
      .sort({ createdAt: -1 });

    res.render('admin/perfumes', {
      perfumes,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewPerfumeForm = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ brandName: 1 });

    res.render('admin/perfume-form', {
      perfume: null,
      brands,
      user: req.user,
    });
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

    const brandDoc = await Brand.findById(brand);
    if (!brandDoc) {
      return res.status(400).send('Invalid brand selected');
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

    await perfume.save();
    res.redirect('/admin/perfumes');
  } catch (error) {
    res.status(500).send('Error creating perfume: ' + error.message);
  }
};

const getEditPerfumeForm = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.id).populate('brand');
    if (!perfume) {
      return res.status(404).send('Perfume not found');
    }

    const brands = await Brand.find().sort({ brandName: 1 });

    res.render('admin/perfume-form', {
      perfume,
      brands,
      user: req.user,
    });
  } catch (error) {
    res.status(500).send('Error loading perfume: ' + error.message);
  }
};

const updatePerfume = async (req, res) => {
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

    const brandDoc = await Brand.findById(brand);
    if (!brandDoc) {
      return res.status(400).send('Invalid brand selected');
    }

    const perfume = await Perfume.findByIdAndUpdate(
      req.params.id,
      {
        perfumeName,
        uri,
        price,
        concentration,
        description,
        ingredients,
        volume,
        targetAudience,
        brand,
      },
      { new: true, runValidators: true }
    );

    if (!perfume) {
      return res.status(404).send('Perfume not found');
    }

    res.redirect('/admin/perfumes');
  } catch (error) {
    res.status(500).send('Error updating perfume: ' + error.message);
  }
};

const deletePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findByIdAndDelete(req.params.id);

    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }

    res.status(200).json({ message: 'Perfume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPerfumes,
  getNewPerfumeForm,
  createPerfume,
  getEditPerfumeForm,
  updatePerfume,
  deletePerfume,
};
