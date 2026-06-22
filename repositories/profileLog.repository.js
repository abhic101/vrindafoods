class ProfileLogRepository {
    constructor (profileModel) {
        this.profileModel = profileModel;
    }

    // Add change log. changesArray is already in required shape
    addLog = (userID, changesArray) => {
        const newLogQuery = new this.profileModel({
            user: userID,
            changes: changesArray,
        });
        return newLogQuery;
    }
}

module.exports = ProfileLogRepository;