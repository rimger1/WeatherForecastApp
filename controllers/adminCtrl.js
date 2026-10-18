

async function getAllUsers(){

    let luid = loadUser() ? loadUser().ID : 0;
    const response = await fetch('http://localhost:3000/users', {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ luid})
    });

    if(response.status !=200){
        const res =await response.json();
        showMessage('danger','error',res.error)
    }
    else{
        const users = await response.json();
        drawTable(users.results)
    }


}

function drawTable(users){
    let userCount = document.querySelector('#userCount')
    userCount.innerHTML = users.length
 
    users.forEach((user,index) => {
        addTableRow(user,index)
    });
}

function addTableRow(user,index){
        let userList = document.querySelector('#userList')

        let tr =document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td3 = document.createElement('td')
        let td4 = document.createElement('td')
        let td5 = document.createElement('td')
        let td6 = document.createElement('td')
        let td7 = document.createElement('td')
        
        td1.innerHTML = (index +1)+ '.'
        td2.innerHTML = user.name
        td3.innerHTML = user.email
        td4.innerHTML = moment(user.registered_at).format('YYYY.MM.DD - H:MM')
        td5.innerHTML = user.last_login ? moment(user.last_login, "YYYYMMDD").fromNow() : 'never'
        td6.innerHTML = user.login_count

        let isActive = user.status ? 'checked': ''
        let isDisabled = user.ID == loadUser().ID ? "disabled" : "" 
        td7.innerHTML = '<div class="form-check form-switch float-end"><input class="form-check-input" type="checkbox" role="switch" id="status"' +isActive+' '+isDisabled+' onclick="changeUserStatus('+user.ID+')"><label class="form-check-label" for="switchCheckDefault"></label></div>'

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        tr.appendChild(td6)
        tr.appendChild(td7)


        userList.appendChild(tr)
}


async function changeUserStatus(uid){


    let luid = loadUser() ? loadUser().ID : 0;
    let data = {
        uid,
        luid
    }

    const response = await fetch('http://localhost:3000/deny', {
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });

     const res =await response.json();

    if(response.status !=200){
        showMessage('danger','error',res.error)
    }
    else{
       
        showMessage('success','OK',res.message)
    }

}