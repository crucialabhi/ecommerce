  document.getElementById("header_search").style.display = 'none';


   async function getAboutUsData(){
    const response = await fetch('/getAboutUsData');
    let result = await response.json();

    document.getElementById('totalCustomers').innerText = (result.data.customerNumberResult[0].totalCustomers -1) + '+'
    document.getElementById('totalProducts').innerText = (result.data.productSoldResult[0].totalProducts -1) + '+'
    document.getElementById('totalOrders').innerText = (result.data.ordersCompletedResult[0].totalOrders -1) + '+'  
   }  