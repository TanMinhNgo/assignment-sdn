const Perfume = require('../models/perfume');
const Brand = require('../models/brand');
const Member = require('../models/member');

// GET admin dashboard
const getDashboard = async (req, res) => {
  try {
    const perfumeCount = await Perfume.countDocuments();
    const brandCount = await Brand.countDocuments();
    const memberCount = await Member.countDocuments();

    res.render('admin/dashboard', {
      stats: {
        perfumes: perfumeCount,
        brands: brandCount,
        members: memberCount,
      },
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all perfumes for admin management
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

// GET form to create new perfume
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

// POST create new perfume
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

// GET form to edit perfume
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

// PUT update perfume
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

// DELETE perfume
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

// GET all brands for admin management
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ brandName: 1 });

    res.render('admin/brands', {
      brands,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET form to create new brand
const getNewBrandForm = async (req, res) => {
  try {
    res.render('admin/brand-form', {
      brand: null,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new brand
const createBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    const brand = new Brand({ brandName });
    await brand.save();

    res.redirect('/admin/brands');
  } catch (error) {
    res.status(500).send('Error creating brand: ' + error.message);
  }
};

// GET form to edit brand
const getEditBrandForm = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).send('Brand not found');
    }

    res.render('admin/brand-form', {
      brand,
      user: req.user,
    });
  } catch (error) {
    res.status(500).send('Error loading brand: ' + error.message);
  }
};

// PUT update brand
const updateBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { brandName },
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).send('Brand not found');
    }

    res.redirect('/admin/brands');
  } catch (error) {
    res.status(500).send('Error updating brand: ' + error.message);
  }
};

// DELETE brand
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all members for admin
const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.render('admin/members', {
      members,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getPerfumes,
  getNewPerfumeForm,
  createPerfume,
  getEditPerfumeForm,
  updatePerfume,
  deletePerfume,
  getBrands,
  getNewBrandForm,
  createBrand,
  getEditBrandForm,
  updateBrand,
  deleteBrand,
  getMembers,
};
