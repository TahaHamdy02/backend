const jwt = require('jsonwebtoken');
const Token = require('../model/Token');
const User = require('../model/User');

const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization || req.headers.Authorization;

  if (!authToken) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  try {
    const token = authToken.split(" ")[1];
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await Token.findOne({ userId: decodedPayload.id, token });

    if (!user) {
      return res.status(404).json({ message: "User not found, don't have an account?" });
    }

    req.user = decodedPayload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token, access denied" });
  }
};

const authorizeRole = (allowedRoles) => (req, res, next) => {
  authenticate(req, res, () => {
    const hasMatchingRole = req.user.role.some((userRole) => allowedRoles.includes(userRole));
    if (hasMatchingRole) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  });
};
const deleteRoles = async (req, res, next) => {
  try {
    await authenticate(req, res);

    const { id } = req.params;
    const { role } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role.includes('Admin')) {
      if (user.role.includes('Admin') || user.role.includes('Manager')) {
        return res.status(403).json({ message: 'Admins cannot delete other admins or managers' });
      } else {
        req.userToDelete = user;
        next();
      }
    } else if (role.includes('Manager') && (user.role.includes('Admin') || user.role.includes('Employee'))) {
      req.userToDelete = user;
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  authenticate,
  authorizeAdmin: authorizeRole(["Admin"]),
  authorizeManager: authorizeRole(["Manager"]),
  authorizeAdminAndManager: authorizeRole(["Admin", "Manager"]),
  deleteRoles
};