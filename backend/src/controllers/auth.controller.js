const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { username, email, password, full_name } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      username,
      email,
      password,
      full_name,
      role: 'viewer',
    });

    const token = generateToken(user);
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    await user.update({ last_login: new Date() });

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone,
        avatar_url: user.avatar_url,
        is_active: user.is_active,
        last_login: user.last_login,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    await user.update({ password: newPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (role) where.role = role;
    if (search) {
      where = {
        ...where,
        [require('sequelize').Op.or]: [
          { email: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { full_name: { [require('sequelize').Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    res.json({
      users: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, phone, avatar_url } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ full_name, phone, avatar_url });

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ is_active: !user.is_active });

    res.json({
      message: `User ${user.is_active ? 'activated' : 'deactivated'}`,
      user: { id: user.id, is_active: user.is_active },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
  changePassword,
  getUsers,
  updateUser,
  toggleUserStatus,
};
