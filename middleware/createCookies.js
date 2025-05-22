
export const createCookie = async(res,cookieName,cookieValue)=>{
    res.cookie(cookieName,cookieValue,{
        httpOnly: false,
        secure: false,
        maxAge: 60* 60 *1000 ,
      })
}