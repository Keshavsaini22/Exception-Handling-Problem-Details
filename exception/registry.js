const {
    ConflictMapper,
    NotFoundMapper,
    BadRequestMapper,
    SequelizeValidationErrorMapper,
    SequelizeUniqueConstraintErrorMapper,
} = require('./mappers');

const { MapperRegistry } = require('http-problem-details-mapper');

class MapperRegistryFactory {

    static create() {

        return new MapperRegistry({ useDefaultErrorMapper: false })
            .registerMapper(new ConflictMapper())
            .registerMapper(new NotFoundMapper())
            .registerMapper(new BadRequestMapper())
            .registerMapper(new SequelizeValidationErrorMapper())
            .registerMapper(new SequelizeUniqueConstraintErrorMapper())
    }
}

module.exports = {
    MapperRegistryFactory
}
