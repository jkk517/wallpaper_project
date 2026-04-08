import express from 'express';
import { createOrder, verifyPayment, getUserOrders, checkPurchase } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/user', protect, getUserOrders);
router.get('/check/:wallpaperId', protect, checkPurchase);

export default router;
