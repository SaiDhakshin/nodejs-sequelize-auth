const login = document.getElementById("loginLink");

login.addEventListener('click',login);

function login(){
    
        fetch("/login",{
            method : 'get',
            headers : {
                "Content-type" : "application/json"
            }
        })
            .then(function(response){
                if(response.status != 200){
                    console.log('Problem status code' + response.status);
                }else{
                    console.log(response.json());
                }
                
            })
            .then(function(data){
                console.log(data)
            })
    
    
}