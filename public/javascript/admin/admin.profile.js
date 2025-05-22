

let div = document.getElementById('viewProfile');


async function goToProfile() {

  let str = " "

  let respone = await fetch('/admin/get-admin-profile');


  if (!respone.ok) {
    let result = await respone.json();
    alert(result.msg)
  }

  let result = await respone.json();

  let profile_image_path = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRIl_pe9IzK6c7SdKf2TS5_q8P43--awu73445aH07eisBuwzwa9vRlZM&s";

  str += `
                <div class="container">
             
             <div class="card">

                <div class="upper">

                    <img src="https://i.imgur.com/Qtrsrk5.jpg" class="img-fluid">
                    
                </div>

              <div class="user">

                <div class="profile">

                  <img src="${profile_image_path}" width="80">
                  
                </div>

              </div>


              <div class="mt-5 text-center">


                <div id='userdetails'>
                    <h4 class="mb-0">${result.data[0].first_name}  ${result.data[0].last_name}</h4>

                    <span class="text-muted d-block mb-2"> ${result.data[0].email} </span>
                    <span class="text-muted d-block mb-3"> +91-${result.data[0].phone_number} </span>
                    <span class="text-muted d-block mb-3">Address : ${result.data[0].address} </span>
                    <span class="text-muted d-block mb-3">City : ${result.data[0].city} </span>
                    <span class="text-muted d-block mb-3">Date Of Birth : ${result.data[0].date_of_birth} </span>

                </div>
                
                </div>
                <button class="logoutbtn" onclick="logout()">Logout</button>
                
              </div>
               
             </div>

           </div>`


  div.innerHTML = str;
  str = " "

}
goToProfile()

function logout() {
  // let response = confirm("Are you sure??");

  Swal.fire({
    text: "Are you sure you want to log out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Logout"
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/admin/logout';
    }
  });
}

