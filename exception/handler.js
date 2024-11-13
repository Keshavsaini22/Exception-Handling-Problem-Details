const { ProblemDocument } = require('http-problem-details');

const { MapperRegistryFactory } = require('./registry');
const mapperRegistry = MapperRegistryFactory.create();

class ErrorHandler {

    constructor(mapperRegistry) {
        this.errorMapperRegistry = mapperRegistry;
    }

    /**
     * Handles errors and sends a standardized RFC 7807 response.
     *
     * @param {Error} error - The error object to be handled.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    handle(error, req, res) {
        // Map the error using the registry
        const errorMapper = this.errorMapperRegistry.getMapper(error);

        const problemDocument = errorMapper?.mapError(error);

        // If no mapping is found, fallback to a generic internal server error
        if (!problemDocument) {
            return res.status(500).json(new ProblemDocument({
                type: '/problems/internal-server-error',
                title: 'Internal Server Error',
                detail: 'An unexpected error occurred.',
                instance: req?.originalUrl,
                status: 500,
            }));
        }

        // Send the mapped error response
        res.status(problemDocument.status).json({
            ...problemDocument,
            instance: req?.originalUrl
        });
    }
}

module.exports = {
    errorHandler: new ErrorHandler(mapperRegistry)
} 