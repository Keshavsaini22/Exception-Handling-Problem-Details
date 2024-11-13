class BadRequest extends Error {
    constructor(message) {
        super(message || "Invalid Request Data or Parameters Provided.");
    }
}

class NotFound extends Error {
    constructor(message) {
        super(message || "Requested Resource Not Found.");
    }
}

class Conflict extends Error {
    constructor(message) {
        super(message || "Conflict with the Current state of the Resource");
    }
}

module.exports = {
    BadRequest,
    NotFound,
    Conflict,
}