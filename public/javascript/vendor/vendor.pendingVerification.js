async function checkVerificationStatus() {
    try {
      const url = "/vendor/check-verification";
      let response = await fetch(url, {
      
      });
      let result = await response.json();

      if (!result.data.success) {
        alert(result.message);
        window.location.href = "/auth/vendor-login";
      } else if (result.data.verificationResult) {
        window.location.href = "/vendor/dashboard";
      }
    } catch (error) {
      console.log(error);
    }
  }
  checkVerificationStatus();