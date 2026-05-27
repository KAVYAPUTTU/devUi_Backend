//async error handler wrapper for Express.js.
//Automatically catch errors from async functions without writing try-catch again and again.

const asyncHandler = (requestHandler) => {
    //asynchandler with promises
    return (req, res, next) => {
        //Promise because async functions always return Promise
        Promise.resolve(requestHandler(req, res, next))
        //sends error to Express error middleware.
        .catch((err) => next(err))
    }

}

export { asyncHandler }

// //async handler is higher order function(A function that receives another function.)Ex:asyncHandler(loginUser)
// // const asyncHandler=()=>{}
// // const asyncHandler=(func)=>{()=>{}}
// // const asyncHandler=(func)=>async()=>{}

// // aynchandler wrapper with try catch
// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }