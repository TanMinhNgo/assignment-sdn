const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Perfume management
router.get('/perfumes', adminController.getPerfumes);
router.get('/perfumes/new', adminController.getNewPerfumeForm);
router.post('/perfumes', adminController.createPerfume);
router.get('/perfumes/:id/edit', adminController.getEditPerfumeForm);
router.put('/perfumes/:id', adminController.updatePerfume);
router.delete('/perfumes/:id', adminController.deletePerfume);

// Brand management
router.get('/brands', adminController.getBrands);
router.get('/brands/new', adminController.getNewBrandForm);
router.post('/brands', adminController.createBrand);
router.get('/brands/:id/edit', adminController.getEditBrandForm);
router.put('/brands/:id', adminController.updateBrand);
router.delete('/brands/:id', adminController.deleteBrand);

// Member management
router.get('/members', adminController.getMembers);

module.exports = router;
