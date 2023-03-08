const { client } = require("./routes/dbhandler");
const crypto = require("crypto");

// Create a session (add to DB)
// userID: the userID to assign the session to
// maxAge: how long the session should last (in ms)
// Returns a new sessionID
function createSession(userID, maxAge) {
	return new Promise((resolve, reject) => {
		client
			.connect()
			.then((res) => {
				const collection = res.db("blurp").collection("sessions");
				let sessionID = crypto.randomUUID();
				collection
					.insertOne({
						sessionID: sessionID,
						userID: userID,
						expires: new Date().getTime() + maxAge,
						data: {},
					})
					.then((res) => {
						resolve(sessionID);
					})
					.catch((err) => {
						reject("Could not add session to database.");
					});
			})
			.catch((err) => {
				reject("Could not connect to database.");
			});
	});
}

// Destroy a session by providing the sessionID
function destroySession(sessionID) {
	return new Promise((resolve, reject) => {
		client
			.connect()
			.then((res) => {
				const collection = res.db("blurp").collection("sessions");
				collection
					.deleteOne({ sessionID: sessionID })
					.then((response) => {
						if (response.deletedCount == 1) {
							resolve("Session was destroyed.");
						} else {
							reject("Session not found.");
						}
					})
					.catch((err) => {
						reject("Session not found.");
					});
			})
			.catch((err) => {
				reject("Could not connect to database.");
			});
	});
}

function deleteExpiredSessions() {
	client
		.connect()
		.then((res) => {
			console.log("Deleting expired sessions.");
			let currentDate = new Date().getTime();
			const collection = res.db("blurp").collection("sessions");
			collection.deleteMany({ expires: { $lt: currentDate } });
		})
		.catch((err) => {
			console.log("Could not delete expired sessions from database.");
			console.log(err);
		});
}

// Provide a sessionID to get a userID
// If userID doesn't exist, reject
function retrieveUserID(sessionID) {
	return new Promise((resolve, reject) => {
		client
			.connect()
			.then((res) => {
				const collection = res.db("blurp").collection("sessions");
				collection
					.findOne({ sessionID: sessionID })
					.then((session) => {
						// If a session was found
						if (session) {
							resolve(session.userID);
						} else {
							reject("Session not found.");
						}
					})
					.catch((err) => {
						reject("Session not found.");
					});
			})
			.catch((err) => {
				reject("Could not connect to database.");
			});
	});
}

module.exports = { createSession, retrieveUserID, destroySession, deleteExpiredSessions };
