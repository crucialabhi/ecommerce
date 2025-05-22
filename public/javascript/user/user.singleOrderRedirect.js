async function getDetails(){

    let order_id = localStorage.getItem('order_id')
    let response = await fetch('/singleOrderDetails',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({order_id: order_id})
    })
    let result = await response.json()
    let orderData = result.data
    let imageArray = orderData.image_path.split(",")

    document.getElementById('productImage').src = imageArray[0]
    document.getElementById('productName').innerHTML += orderData.product_name
    document.getElementById('productPrice').innerHTML +=  orderData.product_price
    document.getElementById('address').innerHTML += orderData.address
    document.getElementById('pincode').innerHTML += orderData.pin_code
    document.getElementById('city').innerHTML += orderData.city
    document.getElementById('state').innerHTML += orderData.state
    document.getElementById('orderStatus').innerHTML += orderData.order_status

    let orderDateArr = orderData.order_date.split("T")
    document.getElementById('orderDate').innerHTML += orderDateArr[0]

    if (orderData.order_status == "complete" && result.message == "Refund request does not exist" || orderData.order_status == "completed" && result.message == "Refund request does not exist") {
      let deliveryDateArr = orderData.delivery_date.split("T")
      document.getElementById('deliveryDate').innerHTML += deliveryDateArr[0]
      document.getElementById('refund-div').style.display = "none"
      document.getElementById('refunded-div').style.display = "none"
      document.getElementById('refund-btn').style.display = "block"
      document.getElementById('refund-btn').onclick = function () {
        refundRequest(orderData.order_id, orderData.delivery_date)
      };
      document.getElementById('billPreview').innerHTML += `<a href="/billPreview?id=${orderData.order_id}">Show Bill</a>`
    }
    else if(orderData.order_status == "complete" && result.message == "Refund request already exist"){
      let deliveryDateArr = orderData.delivery_date.split("T")
      document.getElementById('deliveryDate').innerHTML += deliveryDateArr[0]
      document.getElementById('refund-div').style.display = "block "
      document.getElementById('refund-btn').style.display = "none"
      document.getElementById('refund-div').innerHTML = "Refund Requested"
      document.getElementById('billPreview').innerHTML += `<a href="/billPreview?id=${orderData.order_id}">Show Bill</a>`
    }else if(orderData.order_status == "refunded" && result.message == "Refund request already exist"){
      let deliveryDateArr = orderData.delivery_date.split("T")
      document.getElementById('deliveryDate').innerHTML += deliveryDateArr[0]
      document.getElementById('refund-btn').style.display = "none"
      document.getElementById('refund-div').style.display = "none"
      document.getElementById('refunded-div').innerHTML = "Refund complete"
      document.getElementById('billPreview').innerHTML += `<a href="/billPreview?id=${orderData.order_id}">Show Bill</a>`
    }
    else if(orderData.order_status != "complete"){
      document.getElementById('deliveryDate').innerHTML += "Not Delivered Yet"
      document.getElementById('refund-btn').style.display = "none"
      document.getElementById('refund-div').style.display = "none"
      document.getElementById('refunded-div').style.display = "none"
      document.getElementById('billPreview').innerHTML += `<span>After Delivery</span>`
    }
}



function refundRequest(order_id, delivery_date ){ 
  const currentTime = new Date().toISOString()
  let difference = calculateDifferenceInDays(delivery_date, currentTime)

  if(difference.days > 7){
    alert("Refund request is not possible as 7 days have passed since delivery date")
  }
  else {
    window.location.href='/refundForm'
  }
}


function calculateDifferenceInDays(timestamp1, timestamp2) {
const date1 = new Date(timestamp1); 
const date2 = new Date(timestamp2);
const millisecondsDiff = date2.getTime() - date1.getTime();
const daysDiff = Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24));

return {
    days: daysDiff,
};
}