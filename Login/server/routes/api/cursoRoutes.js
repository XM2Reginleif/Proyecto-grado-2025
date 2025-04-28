import express from 'express';
import { registrarEvaluacion } from '../../controlllers/cursoController.js';
import { auth } from '../../middlewares/auth.js';

const router = express.Router();

console.log("cursoRoutes cargado correctamente")
router.post('/evaluar', auth, registrarEvaluacion);

export default router;
