document.getElementById("login_nav_link").style.color = "#0d9488";
  document.getElementById("header_search").style.display = "none";

  const submitButton = document.getElementById("submitBtn");
  const submitBtnSignup = document.getElementById("submitBtnSignup");

  submitBtnSignup.addEventListener("click", async (e) => {
    e.preventDefault();
    location.replace("/auth/signup");
  });

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.getElementById("form");
    const formData = new FormData(form);
    const response = await fetch("/auth/post-login", {
      method: "post",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
      // Alert
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: result.message,
        showConfirmButton: false,
        timer: 1000,
        customClass: {
          popup: "custom-alert",
        },
      });
    } else if (result.data === true) {
      // alert('OK')
      // Alert
      Swal.fire({
        position: "top-center",
        icon: "success",
        iconColor: 'hsl(176, 88%, 27%)',
        title: result.message,
        showConfirmButton: false,
        timer: 1000,
        customClass: {
          popup: "custom-alert",
        },
      });
      setTimeout(() => {
        document.getElementById("form").reset();
        document.getElementById("form").submit();
      }, 1000);
    }
  });
