
var currentPage = 1;
var lastPage = 1;
function getPosts(page) {
    const baseUrl = "https://tarmeezacademy.com/api/v1/posts";
    toggleLoader()
    axios({
        method: 'get',
        url: `${baseUrl}?limit=8&page=${page}`,
    })
    .then(function (response) {  
        lastPage = response.data.meta.last_page;
         toggleLoader(false)
        
        for (var i = 0; i < response.data.data.length; i++) {
            var user = response.data.data[i];
            var userId = user.author.id;
            console.log(userId);
        
            var cardDiv = document.createElement("div");
            cardDiv.classList.add("card");
        
            // Create unique ids for the card body and header
            var cardBodyId = `card-body-${user.id}`;
            var cardHeaderId = `card-header-${user.id}`;
        
            // Set the inner HTML of cardDiv
            cardDiv.innerHTML = `
                <div class="card-header" id="${cardHeaderId}" data-user-id="${userId}">
                    <img src="${user.author.profile_image}" alt="" style="width: 40px; height: 40px; border-radius: 50%;">
                    <b>${user.author.name}</b>
                </div>
                <div class="card-body shadow-sm" id="${cardBodyId}">
                    <img src="${user.image}" alt="user's image" class="img-fluid">
                    <h6 style="color: gray;">${user.created_at}</h6>
                    <p>${user.body}</p>
                    <hr>
                    <div class="d-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                        </svg>
                        <span>(${user.comments_count}) Comment</span>
                        <button class="btn btn-sm rounded-5 ms-3" style="background-color: gray; color: white;">entertainment</button>
                    </div>
                </div>`;
        
            // Append cardDiv to the card-box
            document.getElementById("card-box").appendChild(cardDiv);
        
            // Add event listener to the card body
            document.getElementById(cardBodyId).addEventListener("click", function() {
                var id = this.getAttribute("id").split("-").pop(); // Extract post id from the id attribute
                window.location = `info.html?postId=${id}`;
            });
        
            // Add event listener to the card header
            document.getElementById(cardHeaderId).addEventListener("click", function() {
                var userId = this.getAttribute("data-user-id"); // Retrieve user id from custom attribute
                window.location = `profile.html?userId=${userId}`;
                
            });
            document.getElementById("profile-btn").addEventListener("click", function() {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) {
                console.log(`user id = ${userData.id}`);
                } 
                window.location = `profile.html?userId=${userData.id}`;
                
            });
        }
        
    })
}

    
// Get posts information
// Call getPostsInfo function when the page loads
window.onload = function() {
    getPostsInfo();
};

function getPostsInfo() {
    changeBtn()
    // Get the URL parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the postId parameter
    const postId = urlParams.get('postId');
    
    var name = document.getElementById("personalUsername");
    var profileImg = document.getElementById("profileImg");
    var userTxt = document.getElementById("user-text");
    var postImg = document.getElementById("postImg");
    var createdAt=document.getElementById("createdAt")
    var personalName=document.getElementById("personal-name")
    var commentSection=document.getElementById("comment-section")

   

    axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
        .then((postResponse) => {
            
            var comments=postResponse.data.data.comments
            var user = postResponse.data.data.author;
            var resp=postResponse.data.data
            name.innerHTML = user.name;
            profileImg.src = user.profile_image; 
            userTxt.innerHTML = postResponse.data.data.body;
            postImg.src = postResponse.data.data.image;
            createdAt.innerHTML=postResponse.data.data.created_at
            personalName.innerHTML=user.name+"'s"+" "
            commentSection.innerHTML=" "
            addComment()
            for(let i=0;i<comments.length;i++){
                
                commentSection.innerHTML += `
    <div class="comment-wrapper">
        <img src="${resp.comments[i].author.profile_image}" alt="" class="comment-profile-image rounded">
        <div class="comment-content">
            <p class="comment-author">${resp.comments[i].author.name}</p>
            <p class="comment-body">${comments[i].body}</p>
        </div>
    </div>`;

                

            }
        })
        .catch((error) => {
            console.error("Error fetching post info:", error);
        });

}
//Add comment

function addComment() {
    if(localStorage.length===0){
        document.getElementById("comment-value").style.display="none"
        document.getElementById("send-comment").style.display="none"
    }
    else{

    
    var token = localStorage.getItem("token");
    var headers = {
        "Authorization": `Bearer ${token}` 
    };
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the postId parameter
    const postId = urlParams.get('postId');

    var commentValue = document.getElementById("comment-value").value;
    
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}/comments`, {"body": commentValue}, {"headers": headers})
        .then((response) => {
            document.getElementById("comment-value").value = "";
            showMsg("Comment added successfully", "success");
            getPostsInfo();
        })
        .catch((err) => {
            const msg = err.response.data.message;
            showMsg(msg, "danger");
        }).finally(()=>{
            
            getPostsInfo()
        });
    }
}
function loginBtn() {
    var username = document.getElementById("username-input").value;
    var password = document.getElementById("password-input").value;

    const params = {
        "username": username,
        "password": password
    };
    toggleLoader()
    axios.post("https://tarmeezacademy.com/api/v1/login", params)
    .then((response) => {
        toggleLoader(false)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const modal = document.getElementById("login-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        changeBtn(); // Update login/logout status after successful login
        displayName()
        showMsg("Log in Successfult","success")
        
        
    })
    .catch((error) => {
        const msg=error.response.data.message
        showMsg(msg,"danger")

    }).finally(()=>{toggleLoader(false)});;
}
function registerBtnClicked(){
    var name = document.getElementById("name-reg").value;
    var usernameReg = document.getElementById("username-reg").value;
    var passwordReg = document.getElementById("password-reg").value;
    var profile_image=document.getElementById("profile-img").files[0]

    let formData=new FormData()
    formData.append("name",name)
    formData.append("username",usernameReg)
    formData.append("password",passwordReg)
    formData.append("image",profile_image)
 

    axios.post("https://tarmeezacademy.com/api/v1/register", formData)
    .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const modal = document.getElementById("register-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        changeBtn(); // Update login/logout status after successful login
        displayName()
        showMsg("Registering Successfully","success")
        
        
    })
    .catch((error) => {
        const errorMsg=error.response.data.message
        showMsg(errorMsg,"danger")
    });
}
function changeBtn() {
    const token = localStorage.getItem("token");
    const loggedinDiv = document.getElementById("loggedin-div");
    const logoutDiv = document.getElementById("logout-div");
    const postButton=document.getElementById("add-btn")

    if (token === null) {
        postButton.style.setProperty("display","none","important")
        loggedinDiv.style.setProperty("display", "flex", "important");
        logoutDiv.style.setProperty("display", "none", "important");
    } else {
        postButton.style.setProperty("display","block","important")
        loggedinDiv.style.setProperty("display", "none", "important");
        logoutDiv.style.setProperty("display", "flex", "important");
        displayName()
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    changeBtn(); // Update login/logout status after logout
    showMsg("Log out Successfuly","danger")
}
function ceateNewPost() {
    var title = document.getElementById("post-title").value;
    var body = document.getElementById("post-body").value;
    var img = document.getElementById("post-img").files[0];
    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    
    // Check if an image is provided
    if (img !== undefined) {
        formData.append("image", img);
    }

    var token = localStorage.getItem("token");
    var headers = {
        "Authorization": `Bearer ${token}` 
    };

    toggleLoader();
    
    axios.post("https://tarmeezacademy.com/api/v1/posts", formData, {
        "headers": headers,
        "Content-Type": "multipart/form-data"
    })
    .then((response) => {
        console.log(response);
        toggleLoader(false);
        const modal = document.getElementById("create-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        
    })
    .catch((error) => {
        const errorMsg = error.response.data.message;
        // Handle error
    }).finally(() => {
        toggleLoader(false);
        getPosts();
    });
}


function showMsg(customMsg,statusColor="success"){//if didnt enter the input for status color the default value will be success 
    var success=""
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
   
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.style.position="fixed"
  wrapper.style.zIndex="999999"
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert"   `,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}
    appendAlert(customMsg, statusColor)
    setTimeout(()=>{
        const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
        alert.close()
    },3000)
    
  }
  function displayName(){
    let nameAndImgDiv=document.getElementById("nameAndImgDiv")
    // Retrieve the JSON string from localStorage
var userJSON = localStorage.getItem("user");

// Parse the JSON string into a JavaScript object
var userObject = JSON.parse(userJSON);

// Access the name property
var name = userObject.name;
var profileImg=JSON.parse(localStorage.getItem("user")).profile_image


nameAndImgDiv.innerHTML=`
<div ><img  src="${profileImg}" style="height: 37px;width: 40px;border-radius:50%;margin-right:15px; " alt=""></div>
<div id="name" class="bg-secondary rounded-start" style="width: 100%;text-align: center;"><h6 style="color: white;" class="pt-2" >Hi ${name}</h6></div>
  
`
  }
  //Infinite Scroll
  if (window.location.pathname === '/home.html') {
    // Attach scroll event listener
    window.addEventListener("scroll", function() {
        let endOfPage = (window.innerHeight + Math.ceil(window.pageYOffset)) >= (document.body.scrollHeight - 45);


        if (endOfPage && currentPage < lastPage) {
            currentPage++;
            getPosts(currentPage);
        }
    });
}
 function toggleLoader(show=true){
      if(show)
      document.getElementById("loader").style.visibility="visible"
      else{
        document.getElementById("loader").style.visibility="hidden"
      }
    }
    //handle night and light mood
   // Function to set the background color based on the stored value in localStorage
function setInitialBackgroundColor() {
    var storedColor = localStorage.getItem("backgroundColor");
    if (storedColor) {
        document.body.style.backgroundColor = storedColor;
    }
}

// Set the initial background color when the page loads
document.addEventListener("DOMContentLoaded", function() {
    setInitialBackgroundColor();
});

// Event listener for the moon icon click
document.getElementById("moon").onclick = function() {
    localStorage.setItem("backgroundColor", "black");
    document.body.style.backgroundColor = "black";
    document.getElementById("moon").style.display = "none";
    document.getElementById("sun").style.display = "block";

};

// Event listener for the sun icon click
document.getElementById("sun").onclick = function() {
    localStorage.setItem("backgroundColor", "#f0ecff");
    document.body.style.backgroundColor = "#f0ecff";
    document.getElementById("sun").style.display = "none";
    document.getElementById("moon").style.display = "block";
    
    
};

    


  

getPosts()

changeBtn()
