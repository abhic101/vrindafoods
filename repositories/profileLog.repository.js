class ProfileLogRepository {
    constructor (model) {
        this.model = model;
    }

    // Add change log. changesArray is already in required shape
    addLog = (userID, changesArray) => {
        const newLogQuery = this.model.create({
            user: userID,
            changes: changesArray,
        });

        return newLogQuery;
    }
}

module.exports = ProfileLogRepository;