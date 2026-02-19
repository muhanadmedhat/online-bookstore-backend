// Suggested approach

// validations/user.js
// export const registerSchema = Joi.object({ ... })

// // middlewares/validate.js
// const validate = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body)
//   if (error) return next(new CustomError(error.message, 400))
//   next()
// }

// // routes/user.js
// router.post('/register', validate(registerSchema), register)