const createOtpBtn = document.getElementById('createOtpBtn');
    const otpVerification =document.getElementById('otpVerification');
    const resetPasswordBtn =document.getElementById('resetPasswordBtn')
    // const submitBtnSignup = document.getElementById('submitBtnSignup');

    // submitBtnSignup.addEventListener('click', async (e) => {
    //   e.preventDefault();
    //   location.replace('/auth/signup');
    // })

    createOtpBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const form = document.getElementById("form");
      const formData = new FormData(form);
      const response = await fetch('/auth/create-otp-forget-password-vendor', {
        method: "post",
        body: formData
      })
      const result = await response.json();
      if (!response.ok) {
        alert(result.message);
        document.getElementById('form').reset();
      } else {
        alert(result.data);
        document.getElementById('form').reset();
        document.getElementById('email').style.display ="none"
        document.getElementById('otp').style.display ="block"

      }
    })

    otpVerification.addEventListener('click', async (e) => {
      e.preventDefault();
      const form = document.getElementById("form");
      const formData = new FormData(form);
      const response = await fetch('/auth/verify-otp-forget-password-vendor', {
        method: "post",
        body: formData
      })
      const result = await response.json();
      if (!response.ok) {
        alert(result.message);
        document.getElementById('form').reset();
      } else {
        alert(result.message);
        document.getElementById('form').reset();
        document.getElementById('otp').style.display ="none"
        document.getElementById('forget-password-div').style.display ="block"
      }
    })

    resetPasswordBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const form = document.getElementById("form");
      const formData = new FormData(form);
      const response = await fetch('/auth/reset-password-vendor', {
        method: "post",
        body: formData
      })
      const result = await response.json();
      if (!response.ok) {
        alert(result.message);
        document.getElementById('form').reset();
      } else {
        alert(result.message);
        document.getElementById('form').reset();
        location.replace('/auth/vendor-login');
      }
    })