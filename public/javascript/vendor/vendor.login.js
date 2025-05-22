const submitButton =document.getElementById('submitBtn');
const submitBtnSignup =document.getElementById('submitBtnSignup');

submitBtnSignup.addEventListener('click',async (e) => {
  e.preventDefault();
  location.replace('/auth/vendor-signup');
})

submitButton.addEventListener('click',async (e) => {
    e.preventDefault();
    const form = document.getElementById("form");
    const formData = new FormData(form);
    const response = await fetch('/auth/post-vendor-login',{
        method:"post",
        body:formData
    })
    const result = await response.json();
    if(!response.ok){
        alert(result.message);
        // document.getElementById('form').reset();
    }
    else{
        alert(result.message);
        document.getElementById('form').reset();
        document.getElementById('form').submit();
    }
})