const ROLES = Object.freeze({
    ADMIN: 'admin',
    MANAGER: 'manager',
    CUSTOMER: 'customer'
});


const PROFILE_LOG_FIELDS = Object.freeze({
    EMAIL: 'auth.email',
    USERNAME: 'auth.username',
    PASSWORD: 'auth.passwordHash',
    ROLE: 'auth.role',
    FIRSTNAME: 'profile.firstname',
    LASTNAME: 'profile.lastname',
    DOB: 'profile.dob',
    PHONE: 'profile.phone',
    COUNTRY_CODE: 'profile.country_code'
});

module.exports = {
    ROLES,
    PROFILE_LOG_FIELDS
}