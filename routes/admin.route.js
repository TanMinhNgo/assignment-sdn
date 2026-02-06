const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const perfumeController = require('../controllers/perfume.controller');
const brandController = require('../controllers/brand.controller');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin);

router.get('/dashboard', adminController.getDashboard);

router.get('/perfumes', perfumeController.getPerfumes);
router.get('/perfumes/new', perfumeController.getNewPerfumeForm);
router.post('/perfumes', perfumeController.createPerfume);
router.get('/perfumes/:id/edit', perfumeController.getEditPerfumeForm);
router.put('/perfumes/:id', perfumeController.updatePerfume);
router.delete('/perfumes/:id', perfumeController.deletePerfume);

router.get('/brands', brandController.getBrands);
router.get('/brands/new', brandController.getNewBrandForm);
router.post('/brands', brandController.createBrand);
router.get('/brands/:id/edit', brandController.getEditBrandForm);
router.put('/brands/:id', brandController.updateBrand);
router.delete('/brands/:id', brandController.deleteBrand);

router.get('/members', adminController.getMembers);

module.exports = router;
