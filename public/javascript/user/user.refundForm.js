function checkValue(select) {
    if(select.value == "other") {
      document.getElementById("userReason").style.display = "block";
      }
      else[
        document.getElementById("userReason").style.display = "none"
      ]
  }


  let orderId = localStorage.getItem('order_id')
  let paymentId ;

  async function fetchDetails() {

    const response = await fetch(`/detailsForRefund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId })
    });
    let result = await response.json()

    if(result.message == true) {

      let deliveryDateArr = result.data.delivery_date.split("T")

      document.getElementById('productName').innerHTML += result.data.product_name;
      document.getElementById('productPrice').innerHTML += result.data.product_price;
      document.getElementById('deliveryDate').innerHTML += deliveryDateArr[0];
      paymentId = result.data.payment_id;
    } else {
      alert('Failed to fetch order details. Please try again.');
    }
  }

  document.getElementById('submit-btn').addEventListener('click', async (e) => {

    e.preventDefault();
    const reason = document.getElementById('reasons').value;
    const userReason = document.getElementById('userReason').value;

    if (reason === "") {
      alert("Please select a reason for the refund.");
      return;
    }
    if (reason === "other" && userReason.trim() === "") {
      alert("Please provide a reason for the refund.");
      return;
    }
    const response = await fetch('/submitRefundData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({orderId, paymentId, reason, userReason })
    });
    const result = await response.json();

    if (result.data == true) {
      alert("Refund request submitted successfully.");
      window.location.href = '/user-profile-page';
    } else {
      alert("Failed to submit refund request. Please try again.");
      
    }
  });
