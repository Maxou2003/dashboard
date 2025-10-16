const express = require('express');
const router = express.Router();
const ApiController = require('../Controllers/ApiController');
const HostsController = require('../Controllers/HostsController')



router.get('/play',ApiController.runPlayBook);
router.get('/host',HostsController.getHostByIp);
router.get('/playbooks',ApiController.getAvailablePlaybooks);

module.exports = router;