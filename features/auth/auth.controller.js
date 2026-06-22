class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    // login endpoint handler. Sends secure, httpOnly cookie with jwt inside, age same as jwt
    login = async (req, res, next) => {
        try {
            const {username, email, password} = req.body;
            const identifier = username ? username : email;
            const token = await this.authService.login(identifier, password);
            res.cookie('auth', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1 * 24 * 60 * 60 * 100
            });
            res.status(200).json({
                message: 'Login successfull',
                success: true
            });
        } catch(err) {
            next(err);
        }
    }

    signup = async (req, res, next) => {
        try {
            const signupData = req.body;
            await this.authService.signup(signupData);
            res.status(200).json({
                message: 'user created succesfully',
                success: true
            })
        } catch(err) {
            next(err);
        }
    }
}

module.exports = AuthController;