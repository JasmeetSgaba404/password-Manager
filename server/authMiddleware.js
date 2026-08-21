import jwt from "jsonwebtoken";



export const getToken = async (req, res, next) => {

    // console.log("1: ", req.cookies)
    // console.log("2: ", req.headers.cookies)

    try {
        const {token} = req.cookies;

        console.log(token)

        if(!token){
         return res.status(401).json("Unauthorised User")
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET);

        console.log(verify)

        req.user = verify;
        next();

    } catch (error) {
        res.status(401).json("Unauthorised")
    }
}
