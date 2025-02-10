const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || l3LEcKDrj6NEzUUDP4u2J6E2AB8jyzfH ;

const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '8h' });
};


const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'Access Denied, No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid Token' });
    }
};

module.exports = { generateToken, verifyToken };
