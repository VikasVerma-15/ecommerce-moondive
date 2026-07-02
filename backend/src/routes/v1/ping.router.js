import express from 'express';
import { pinghandler } from '../../controllers/ping.controller.js';

const v1router = express.Router();

v1router.get('/ping',pinghandler);

export default v1router;
