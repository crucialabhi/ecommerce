document.getElementById("header_search").style.display = 'none';
document.getElementById("signup_nav_link").style.color = '#0d9488';
  
  const submitButton = document.getElementById('submitBtn');
  const submitBtnLogin = document.getElementById('submitBtnLogin');

  submitBtnLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    location.replace('/auth/login');
  });

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault()
    document.getElementById('registration').style.display = "none";
    document.getElementById('loader').style.display = "grid";
    const form = document.getElementById('form')
    const formData = new FormData(form)
    const response = await fetch('/auth/validate-user-details', {
      method: 'post',
      body: formData
    })
    const result = await response.json()
    if (!response.ok) {
      document.getElementById('loader').style.display = "none"
      document.getElementById('registration').style.display = "block";
      alert(result.message)
    } else {
      alert(result.data.mailMessage)
      document.getElementById('loader').style.display = "none"

      document.getElementById('form').reset()
      document.getElementById('registration').style.display = "block";
      document.getElementById('form').submit()
    }
  })