const asyncHandler=(requestHandler)=> {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((error) => {
            next(error);
        })
    }
}

export {asyncHandler}


// const asyncHandler=(fn) => {};
// const asyncHandler=(fn) => {()=>{}};
// const asyncHandler=(fn) => ()=>{};
// const asyncHandler=(fn) => async ()=>{};


// const asyncHandler=(fn) => async ()=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         resizeBy.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         });
//     }
// };