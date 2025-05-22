const submitButton = document.getElementById('submitBtn');

    submitButton.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const form = document.getElementById("form");
      const formData = new FormData(form);
      const response = await fetch('/auth/post-signup', {
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
        document.getElementById('form').submit()
      }
    })

    async function authoriseUserApi() {
 
      const response = await fetch('/auth/authorise-user-api', {
        method: "post",
      })
      const result = await response.json();
      if (!response.ok) {
        alert(result.message);
        location.replace("/auth/signup");
      }
    }
    authoriseUserApi();