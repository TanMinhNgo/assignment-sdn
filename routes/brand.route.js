const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const { isAdmin } = require('../middleware/auth');

// Public route - anyone can GET brands
router.get('/', brandController.getAllBrands);
router.get('/:brandId', brandController.getBrandById);

// Protected routes - only Admin can POST, PUT, DELETE
router.post('/', isAdmin, brandController.createBrand);
router.put('/:brandId', isAdmin, brandController.updateBrand);
router.delete('/:brandId', isAdmin, brandController.deleteBrand);

module.exports = router;
