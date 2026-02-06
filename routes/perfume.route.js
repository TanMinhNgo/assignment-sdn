const express = require('express');
const router = express.Router();
const perfumeController = require('../controllers/perfume.controller');
const { isAdmin } = require('../middleware/auth');

// Public routes - anyone can GET perfumes
router.get('/', perfumeController.getAllPerfumes);
router.get('/:perfumeId', perfumeController.getPerfumeById);

// Protected routes - only Admin can POST, PUT, DELETE perfumes
router.post('/', isAdmin, perfumeController.createPerfume);
router.put('/:perfumeId', isAdmin, perfumeController.updatePerfume);
router.delete('/:perfumeId', isAdmin, perfumeController.deletePerfume);

module.exports = router;
