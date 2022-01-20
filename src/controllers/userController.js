const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.newUser = async (req, res) => {
try {
    const { firstname, lastname, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        return res.status(400).send({
            message: 'User already exists',
        });
    }

    const newUser = new User({
        firstname,
        lastname,
        email,
        password,
    });

    await newUser.save();

    res.status(201).send({
        data: newUser,
    });
} catch (error) {
    res.status(500).send({
        status: 500,
        error: error.message,
    });
}
}

exports.getUser = async (req, res) => {
    try {
        const id = req.params._id;

        const user = await User.findById({_id: id});

        if (!user) {
            return res.status(404).send({
               message: 'User not found',
            });
        }

        res.status(200).send({
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            error,
        });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});

        if (!users) {
            return res.status(404).send({
                message: 'No users found',
            });
        }

        res.status(200).send({
            data: users,
        });
    } catch (error) {
        res.status(500).send({
        error,
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.params._id;

        const updates = Object.keys(req.body);

        const user = await User.findById({_id: id}).exec();

        if (!user) {
            return res.status(404).send({
                message: 'User not found',
            });
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        }
        );

        await user.save();

        res.status(200).send({
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            error,
        });
    }
        
}

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params._id;

        const user = await User.findById({_id: id}).exec();

        if (!user) {
            return res.status(404).send({
                message: 'User not found',
            });
        }

        await user.remove();

        res.status(200).send({
            message: 'User deleted',
        });
    } catch (error) {
        res.status(500).send({
            error,
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(401).send({
                message: 'User not found',
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                message: 'Incorrect Password, Try again!',
            });
        }

        await user.generateAuthToken();
        await user.generateRefreshToken();

        res.status(200).send({
            data: user,
            message: "login successful",
        });
    } catch (error) {
        res.status(500).send({
            error,
        });
    }
}

exports.refreshTokenUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).send({
                message: 'No refresh token provided',
            });
        }

        await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findOne( refreshToken._id ).exec();

        if (!user) {
            return res.status(401).send({
                message: 'User not found',
            });
        }

        await user.generateAuthToken();
        res.status(200).send({
            data: user.token,
            message: 'Refresh token successful',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error,
        });
    }
}

exports.logoutUser = async (req, res) => {
    try {

        const id = req.params._id;
        const user = await User.findOne({ _id: id }).exec();

        if (!user) {
            return res.status(401).send({
                message: 'User not found',
            });
        }

        user.token = '';

        user.refreshToken = '';

        await user.save();

        res.status(200).send({
            message: 'Logout successful',
        });
    } catch (error) {
        res.status(500).send({
            error,
        });
    }
}