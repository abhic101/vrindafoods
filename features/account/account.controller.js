class AccountController {
    /**
     * 
     * @param {import('./account.services')} accountService
     */
    constructor (accountService) {
        this.accountService = accountService;
    }

    async getProfile (req, res, next) {
        try {
            const profile = await this.accountService.getProfile(req.user.userId);
            res.status(201).json({
                status: true,
                message: 'profile fetched successfully',
                profile: profile
            })
        } catch(err) {
            next(err);
        }
    }

    async changePassword (req, res, next) {
        try {
            const {currentPassword, newPassword} = req.body;
            await this.accountService.changePassword(req.user.userId, {currentPassword, newPassword});

            // Clear auth cookie and prompt re-login
            res.clearCookie('auth');
            res.status(201).json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch(err) {
            next(err);
        }
    }

    async changeUsername (req, res, next) {
        try {
            const {password, newUsername} = req.body;
            await this.accountService.changeUsername(req.user.userId, {password, newUsername});
            res.status(201).json({
                success: true,
                message: 'Username changed successfully'
            });
        } catch(err) {
            next(err);
        }
    }

    async changeEmail (req, res, next) {
        try {
            const {password, newEmail} = req.body;
            await this.accountService.changeEmail(req.user.userId, {password, newEmail});
            res.status(201).json({
                success: true,
                message: 'Email successfully changed'
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteAccount (req, res, next) {
        try {
            const password = req.body.password;
            await this.accountService.deleteAccount(req.user.userId, password);
            res.status(201).json({
                success: true,
                message: 'Account deleted successfully'
            })
        } catch(err) {
            next(err);
        }
    }

    async updateProfile (req, res, next) {
        try {
            const profile = await this.accountService.updateProfile(req.user.userId, req.body);
            res.status(201).json({
                success: true,
                message: 'Profile updated',
                profile
            })
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AccountController;