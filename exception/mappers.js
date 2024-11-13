const { ErrorMapper } = require('http-problem-details-mapper');
const { ProblemDocument } = require('http-problem-details');
const { Sequelize } = require('sequelize');

const { BadRequest, Conflict, NotFound } = require("./http-exceptions");
const { StatusCodes: HTTP_STATUS_CODE } = require('http-status-codes');

class ConflictMapper extends ErrorMapper {

    constructor() {
        super(Conflict);
    }

    mapError(error) {
        return new ProblemDocument({
            type: '/problems/conflict',
            title: 'Conflict with Current State of the Resource',
            detail: error.message,
            status: HTTP_STATUS_CODE.CONFLICT,
        });
    }
}

class NotFoundMapper extends ErrorMapper {

    constructor() {
        super(NotFound);
    }

    mapError(error) {
        return new ProblemDocument({
            type: '/problems/not-found',
            title: 'Requested Resource Not Found',
            detail: error.message,
            status: HTTP_STATUS_CODE.NOT_FOUND,
        });
    }
}

class BadRequestMapper extends ErrorMapper {

    constructor() {
        super(BadRequest);
    }

    mapError(error) {
        return new ProblemDocument({
            type: '/problems/bad-request',
            title: 'Invalid Request Data or Parameters Provided',
            detail: error.message,
            status: HTTP_STATUS_CODE.BAD_REQUEST,
        });
    }
}

class SequelizeValidationErrorMapper extends ErrorMapper {

    constructor() {
        super(Sequelize.ValidationError);
    }

    mapError(error) {
        return new ProblemDocument({
            type: '/problems/validation-error',
            title: 'Data Validation Failed: One or More Fields are Incorrect',
            detail: error.errors.map(err => err.message).join(', '),
            status: HTTP_STATUS_CODE.BAD_REQUEST,
        });
    }
}

class SequelizeUniqueConstraintErrorMapper extends ErrorMapper {

    constructor() {
        super(Sequelize.UniqueConstraintError);
    }

    mapError(error) {
        return new ProblemDocument({
            type: '/problems/unique-constraint-error',
            title: 'Unique Constraint Violation: Duplicate Entry for a Unique Field',
            detail: error.errors.map(err => err.message).join(', '),
            status: HTTP_STATUS_CODE.CONFLICT,
        });
    }
}

module.exports = {
    ConflictMapper,
    NotFoundMapper,
    BadRequestMapper,
    SequelizeValidationErrorMapper,
    SequelizeUniqueConstraintErrorMapper
}