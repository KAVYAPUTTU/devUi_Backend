//this async handler makes a method and returns it
const asyncHandler = (requestHandler) => {
    //asynchandler with promises
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }

}

export { asyncHandler }

// //async handler is higher order function(which takes fn as parameter)
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