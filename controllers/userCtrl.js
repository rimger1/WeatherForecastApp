

async function registerUser(){
    const name = document.querySelector('#name')
    const email = document.querySelector('#email')
    const passwd = document.querySelector('#passwd')
    const confirm = document.querySelector('#confirm')

    let user= {
        name: name.value,
        email: email.value,
        passwd: passwd.value,
        confirm: confirm.value
    }

    const response = await fetch('http://localhost:3000/register',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    })
        
    let res = await response.json()

    if (response.status!=200){
        showMessage('danger','ERROR',res.error)
    }
    else{
        showMessage('success','ok',res.message)
        naviagte('users/login')
    }
}


async function loginUser(){
    let email= document.querySelector('#email').value;
    let passwd= document.querySelector('#passwd').value;

    let user = {
        email,
        passwd
    }
        //todo
    const response =  await fetch('http://localhost:3000/login',{
       method : 'POST',
        headers : {"Content-Type": "Application/json"},
        body : JSON.stringify(user)
    })

    let res = await response.json();

    if (response.status!=200){
        showMessage('danger','ERROR',res.error)
    }
    else{
        showMessage('success','ok',res.message)
        storeUser(res.user)
        loginCheck()
    }
}

function logout(){
    clearUser()
    loginCheck()
    navigate('users/home')
}

function storeUser(user){
    sessionStorage.setItem('WFUser', JSON.stringify(user))
}

function loadUser(){
    let user = JSON.parse(sessionStorage.getItem('WFUser'))
    return user;
}

function clearUser(){
    sessionStorage.removeItem('WFUser')
}

function loginCheck(){
    if (user = loadUser()){
        if(user.role == 'admin'){
            setMenuItems('admin')
            navigate('admin/add_weather')
        }
        else{
            setMenuItems('user')
            navigate('users/weather')
        }
    }
    else{
        setMenuItems('')
    }
}

function setMenuItems(params){
    let guestMenu = document.querySelector('#guestmenu')
    let adminMenu = document.querySelector('#adminmenu')
    let userMenu = document.querySelector('#usermenu')


    switch(params){
        case 'admin': {
            guestMenu.classList.add('hide')
            userMenu.classList.add('hide')
            adminMenu.classList.remove('hide')
            break;
        }
        case 'user': {
            guestMenu.classList.add('hide')
            adminMenu.classList.add('hide')
            userMenu.classList.remove('hide')
            break;
        }
        default : {
            adminMenu.classList.add('hide')
            userMenu.classList.add('hide')
            guestMenu.classList.remove('hide')
            break;
        }
    }
}

async function updateProfile(){
    let name = document.querySelector('#name')
    let email = document.querySelector('#email')

    let loggeduser = loadUser()

    let data={
        username: name.value,
        email: email.value,
        luid: loggeduser.ID
    }

    const response =  await fetch(`http://localhost:3000/profile/${loggeduser.ID}`,{
        method : 'PATCH',
        headers : {"Content-Type": "Application/json"},
        body : JSON.stringify(data)
    })
    
    let res = await response.json();
    
    console.log(response.status)
    if (response.status!=200){
        showMessage('danger','ERROR',res.error)
    }
    else{
        showMessage('success','ok',res.message)
        let user ={
            ID: loggeduser.ID,
            name: name.value,
            email: email.value,
            role: loggeduser.role
        }
        storeUser(user)
    }
}

async function updatePasswd(){
    let oldpass = document.querySelector('#oldpass')
    let newpass = document.querySelector('#newpass')
    let confirm = document.querySelector('#confirm')

    let data={
        oldPasswd: oldpass.value,
        newPasswd: newpass.value,
        confirm: confirm.value
    }

    let uid = loadUser() ? loadUser().ID : 0;

    const response =  await fetch(`http://localhost:3000/passmod/${uid}`,{
        method : 'PATCH',
        headers : {"Content-Type": "Application/json"},
        body : JSON.stringify(data)
    })
    
    let res = await response.json();
    
    console.log(response.status)
    if (response.status!=200){
        showMessage('danger','ERROR',res.error)
    }
    else{
        showMessage('success','ok',res.message)
        oldpass.value=''
        newpass.value=''
        confirm.value=''
    }
}

function getUserData(){
    let user = loadUser()

    document.querySelector('#name').value = user.name
    document.querySelector('#email').value = user.email

}