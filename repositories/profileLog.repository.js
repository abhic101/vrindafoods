class ProfileLogRepository {
    constructor (profileModel) {
        this.profileModel = profileModel;
    }

    /**
     * Add user change log
     * 
     * @param {string} userID ObjectId of user as string
     * @param {Array} changesArray Array that is already in required shape
     * @returns 
     */
    addLog (userID, changesArray) {
        const newLogQuery = new this.profileModel({
            user: userID,
            changes: changesArray,
        });
        return newLogQuery;
    }
}

module.exports = ProfileLogRepository;