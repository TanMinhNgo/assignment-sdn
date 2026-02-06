const Brand = require('../models/brand');

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

module.exports = {
  getBrands,
  getNewBrandForm,
  createBrand,
  getEditBrandForm,
  updateBrand,
  deleteBrand,
};
