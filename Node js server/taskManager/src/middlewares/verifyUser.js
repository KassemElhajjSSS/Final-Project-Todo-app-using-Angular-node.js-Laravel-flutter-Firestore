const axios = require('axios');

const verifyUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer {token}"

    if (!token) return res.status(401).json({ status: 'failed', message: 'No token provided' });

    try {
        // Call Laravel API to verify token and retrieve user
        const response = await axios.get('http://127.0.0.1:8000/api/getAuth', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'ok') {
            req.userId = response.data.user.id;  // Set userId in request
            req.userName= response.data.user.name;  // Set username in request
            next();
        } else {
            res.status(401).json({ status: 'failed', message: 'Invalid token' });
        }
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Token verification failed' });
    }
};


module.exports = {
    verifyUser
}