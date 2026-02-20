const Joi = require('joi');

const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessages = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return res.status(400).json({
                error: 'Validation failed',
                details: errorMessages
            });
        }

        req[property] = value;
        next();
    };
};

const validateMongoId = (req, res, next) => {
    const id = req.params.id;
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!mongoIdRegex.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format. Must be a valid MongoDB ObjectId.' });
    }

    next();
};

module.exports = {
    validate,
    validateMongoId
};
