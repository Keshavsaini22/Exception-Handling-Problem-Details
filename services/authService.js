const { error } = require("../libs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authRepository } = require("../repositories");
const publisher = require("../pub-sub/publish");
const { BadRequest } = require("../exception/http-exceptions");

class AuthService {

    static async register(payload) {
        const { username, email, password } = payload.body;
        const files = payload.files;
        const docs = []
        if (files && files['docs']) {
            files['docs'].forEach(file => {
                docs.push(file.path);
            });
        }
        if (!email) throw new BadRequest('Email is required');
        if (!username) throw new BadRequest('Username is required');
        if (!password) throw new BadRequest('Password is required');

        let user = await authRepository.findOne({ email });
        if (user) throw new BadRequest('User already exists');
        const hashedPassword = await bcrypt.hash(password, 10);
        await authRepository.create({ ...payload.body, username, email, password: hashedPassword, docs });
        await publisher.publish('user', { email: email, event: 'send-mail' });
        return "User registered successfully"
    }

    static async login(payload) {
        const { email, password } = payload.body;
        if (!email) throw new error.badRequest('Email or username is required');
        if (!password) throw new error.badRequest('Password is required');

        let whereobj = {};
        // Regular expression to match email pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            whereobj.email = email;
        }
        else {
            whereobj.username = email;
        }

        let user = await authRepository.findOne(whereobj);
        if (!user) throw new error.badRequest('Invalid credentials');
        user = user.toJSON();
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new error.badRequest('Invalid credentials');
        delete user.password;
        const token = jwt.sign(user, process.env.JWT_SECRET);
        return { user, token };
    }

}

module.exports = AuthService