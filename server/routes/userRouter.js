const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/users', userController.allUsers);
router.post('/delete', userController.delUser);
router.post('/block', userController.blockUser);
router.post('/unblock', userController.unblockUser);

module.exports = router;
