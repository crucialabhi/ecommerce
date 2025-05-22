import bcrypt from "bcrypt";

export const hashData = async (password) => {
    return await bcrypt.hash(password, 10);
} 

export const verifyHashData = async (plainData,hashData) => {
    return await bcrypt.compare(plainData, hashData);
}


