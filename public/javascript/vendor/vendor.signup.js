const submitButton = document.getElementById('submitBtn')
const submitBtnLogin = document.getElementById('submitBtnLogin')

submitBtnLogin.addEventListener('click', async e => {
  e.preventDefault()
  location.replace('/auth/vendor-login')
})

submitButton.addEventListener('click', async e => {
  e.preventDefault()
  document.getElementsByClassName('loaderParent')[0].style.display = 'block'
  const form = document.getElementById('form')
  const formData = new FormData(form)

  const response = await fetch('/auth/validate-vendor-details', {
    method: 'post',
    body: formData
  })
  const result  = await response.json()
  document.getElementsByClassName('loaderParent')[0].style.display = 'none'

  if (!response.ok) {
    alert(result.message)
  } else {
    alert(result.data.mailMessage)
   
    document.getElementById('form').reset()
    document.getElementById('form').submit()
  }
})

async function check(r) {
  let controlName = r.id
  if (controlName == 'City') {
    return
  }
  let num = document.getElementById(`${controlName}`).selectedIndex
  const id = num
  const response = await fetch('/auth/getCity', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id, name: controlName })
  })

  const result = await response.json()
  if (!response.ok) {
    alert(result.message)
  }
  document.getElementById(`city`).innerHTML = result.data
}