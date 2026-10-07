

async function registerUser(){
    const name = document.querySelector('#name')
    const email = document.querySelector('#email')
    const passwd = document.querySelector('#passwd')
    const confirm = document.querySelector('#confirm')

    let usser= {
        name: name.value,
        email: email.value,
        passwd: passwd.value,
        confirm: confirm.value
    }

    const response = await fetch('http://localhost:3000/users/register',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        body: JSON.stringify(usser)
    })
}