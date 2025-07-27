import jwt from "jsonwebtoken";
const { JsonWebTokenError } = jwt;

//function to generate token

export const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET)
    return token

}