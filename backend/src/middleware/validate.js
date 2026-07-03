export const validate = (schema) => {
    return (req, res, next) => {
        // If req.body is undefined (e.g. wrong content-type), fallback to {} so Joi can catch missing fields
        const { error, value } = schema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        
        // Overwrite req.body with Joi's parsed/coerced values (e.g. converting string "99" to number 99)
        req.body = value;
        next();
    };
};