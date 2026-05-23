import jwt from "jsonwebtoken";



const getToken = async (req, res, next) => {

    try {
        const {token} = req.cookies;

        if(!token){
         return res.status(401).json("Unauthorised User")
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET);


    } catch (error) {
        res.status(401).json("Unauthorised")
    }
}
