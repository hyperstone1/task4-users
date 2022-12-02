const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/models');

const generateJwt = (id, email, name) => {
  return jwt.sign({ id, email, name }, process.env.SECRET_KEY, { expiresIn: '24h' });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, firstName, date } = req.body;
    if (!email || !password || !firstName) {
      return next(ApiError.badRequest('Fill in the text fields'));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('User with this email already exists'));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      password: hashPassword,
      name: firstName,
      dateLogin: date,
    });
    const token = generateJwt(user.id, user.email, user.name);
    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password, date } = req.body;
    const user = await User.findOne({ where: { email } });
    const updatedDate = await User.update({ dateLogin: date }, { where: { email } });
    if (!user) {
      return next(ApiError.internal('User with this name not found'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Wrong password specified'));
    }
    if (user.status === 'blocked') {
      return next(ApiError.internal('The user is blocked'));
    }
    const token = jwt.sign({ id: user.id, email, name: user.name }, process.env.SECRET_KEY, {
      expiresIn: '24h',
    });
    return res.json({ token });
  }

  async allUsers(req, res) {
    try {
      const usersTable = await User.findAll();
      res.json(usersTable);
    } catch (error) {
      res.json({ message: error.message });
    }
  }

  async delUser(req, res) {
    try {
      req.body.map(async (item) => {
        await User.destroy({ where: { id: item } });
      });
      res.json('Successfully removed');
    } catch (error) {
      res.json(error);
    }
  }

  async blockUser(req, res) {
    try {

      req.body.map((item) => {
        User.update({ status: 'blocked' }, { where: { id: item } });
      });
      res.json('Successfully blocked');
    } catch (error) {
      res.json({ message: error.message });
    }
  }

  async unblockUser(req, res) {
    try {
      req.body.map((item) => {
        const updateUser = User.update({ status: 'unblocked' }, { where: { id: item } });
      });
      res.json('Successfully unblocked');
    } catch (error) {
      res.json({ message: error.message });
    }
  }
}

module.exports = new UserController();
