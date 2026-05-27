//to standardise the error we send evry time in error response
//in node we have a class Error which have lots of methods in it
//This code creates a custom error class in Node.js so that all API errors follow the same structure.
class ApiError extends Error {
    constructor(
        //These parameters are simply inputs that the constructor receives when an object is created.
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        //Calling Parent Constructor(super(message) does Error(message))
        super(message)
        //Take received values and store them inside object
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }