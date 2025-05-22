import con from "../database/connection.js"
const fetchvendors = async () => {
    let [result] = await con.query(`select * from vendor_details`)
    return result
}
export {fetchvendors}