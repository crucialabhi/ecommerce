import connection from "../database/connection.js"

const setOfferPrice = async (data) => {
    try {
        let offerObject = {};
        let [result] = await connection.query(`SELECT * FROM offers_details`);

        for (const e of result) {
            if (e.is_expired == 0) {
                offerObject[`${e.parent_category_id}`] = +e.offer_name;
            }
        }
        
        for (const element of data) {
            if (offerObject[`${element.category_id}`]) {
                element['offer_price'] = (element.price * (100 - offerObject[`${element.category_id}`])) / 100;
            } else {
                element['offer_price'] = element.price;
            }
        }
        return data;
    } catch (error) {
        console.log(error);
    }
}
export default setOfferPrice;