let account_status_btn = document.getElementById('account_status_btn')
account_status_btn.addEventListener('click', async (e) => {

  let userConfirm = confirm(`are you sure ${e.target.innerHTML}`)
  if (userConfirm) {
    let resultOfAccountStatus = await fetch('/vendor/updateVendorStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: e.target.innerHTML
      })
    })
    let data = await resultOfAccountStatus.json()

    if (resultOfAccountStatus.status == 200) {
      if (data.message == 'Deactivate your account') {
        account_status_btn.innerHTML = 'Activate your account'
        account_status_btn.style.color = 'green';
        account_status_btn.style.border = '1px solid green';
      } else {
        account_status_btn.innerHTML = 'Deactivate your account'
        account_status_btn.style.color = 'red';
        account_status_btn.style.border = '1px solid red';
      }

    }
  }


})

function preview(elem, output = "") {

  // Array.from(elem.files).map((file) => {
    const blobUrl = window.URL.createObjectURL(elem.files[0]);
    // output += `<img src=${blobUrl} width="60" height="60">`;
    document.getElementById("imgID").src = blobUrl;
  // });
  // elem.nextElementSibling.innerHTML = output
}
async function getProfileDetails() {
  try {
    const url = `/vendor/getProfileDetails`;
    const response = await fetch(url);

    const result = await response.json();
    if (!result.data.success) {
      alert(result.message)
      window.location.href = '/auth/vendor-login'
    }

    let img = document.getElementById('imgDiv')
    let fname = document.getElementById('firstName')
    let lname = document.getElementById('lastName')
    let MobileNum = document.getElementById('MobileNum')
    let companyName = document.getElementById('companyName')
    let ProfileImgId = document.getElementById('imgID')

    fname.value = result.data.profileDetails[0].first_name
    lname.value = result.data.profileDetails[0].last_name
    MobileNum.value = result.data.profileDetails[0].mobile_number
    companyName.value = result.data.profileDetails[0].company_name
    ProfileImgId.src = result.data.profileDetails[0].vendor_img
    let accountStatus = result.data.profileDetails[0].is_active

    if (accountStatus == 1) {
      account_status_btn.innerHTML = 'Deactivate your account';
      account_status_btn.style.color = 'red';
      account_status_btn.style.border = '1px solid red';
    } else {
      account_status_btn.innerHTML = 'Activate your account';
      account_status_btn.style.color = 'green';
      account_status_btn.style.border = '1px solid green';
    }



  } catch (error) {
    console.log(error);
  }
}

getProfileDetails();

async function editProfile(e) {

  e.preventDefault()
  try {

    const url = `/vendor/editProfileDetails`;
    const formdata = new FormData(document.getElementById("profileDetailForm"));
    console.log(formdata);

    const response = await fetch(url, {

      method: "POST",
      body: formdata
    });
    const result = await response.json();
    if(result.message == 'your session has been expired'){
      window.location.href = "/auth/vendor-login";
    }

    if (!result.data.success) {
      alert(result.message)
    
    }
    else {
      // getProfileDetails();
      // Alert 
      Swal.fire({ position: "top-center", icon: "success", iconColor: 'hsl(176, 88%, 27%)',title: "Profile details updated successfully", showConfirmButton: false, timer: 1000, customClass: { popup: "custom-alert", }, });
    }

  } catch (error) {
    console.log(error);
  }

}
