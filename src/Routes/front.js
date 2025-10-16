const express = require('express');
const router = express.Router();
const frontController = require('../Controllers/FrontController')


router.get("/",frontController.dashboard);


module.exports = router;