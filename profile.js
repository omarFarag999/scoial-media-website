const userData = JSON.parse(localStorage.getItem('user'));

function UserId(){
    // Get the URL parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // Get the value of the postId parameter
     var userId = urlParams.get('userId');
     return userId
}
function getProfileInfo(){
    var userId=UserId(userId=userData)
    const profileDiv=document.getElementById("profile-div")
    console.log(`postId=${userId}`)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}`)
    .then((response)=>{
        var user=response.data.data
        profileDiv.innerHTML=`
        <div class=" d-flex justify-content-center " > 

        <div class="col-9 " id="profile-card">
          <div class="card text-center">
            <div class="card-header">
              Profile
            </div>
            <div class="card-body" style="position: relative;">
              <!--for profile image-->
              <div id="image-div">
                <img src="${user.profile_image}"  alt="..." id="profile-image"> 
              </div>
              <!--for username,email,name-->
              <div  id="users-data">
              
                <div class="d-flex"><h5>Name:</h5><span id="profile-name">${user.name}</span></div>
                <div class="d-flex"><h5>Username:</h5><span id="profile-username">${user.username}</span></div>
                <div class="d-flex"><h5>email:</h5><span id="profile-email">${user.email}</span></div>
              </div>
              <!--for count comments and posts-->
              <div>
                <div class="d-flex progress-handling" ><h1>${user.posts_count}</h1><h6 class="pt-3">Posts</h6></div>
                <div class="d-flex progress-handling" ><h1>${user.comments_count}</h1><h6 class="pt-3">Comments</h6></div>

              </div>
              
            </div>
          </div>
        </div>
        
      </div>
        `
    
})
    }
    function getUserPosts() {
      var postsDiv = document.getElementById("posts-div");
      var userId=UserId()
      axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`)
        .then((response) => {
          console.log(response.data.data[0].id)
          for (var i = 0; i < response.data.data.length; i++) {
            var user = response.data.data[i].author;
            var userBody = response.data.data[i];
    
            postsDiv.innerHTML += `
              <div class="d-flex justify-content-center"> 
                <div class="col-9" id="card-box">
                  <div class="card shadow-sm">
                    <div class="card-header">
                      <img src="${user.profile_image}" alt="" style="width: 40px; height: 40px; border-radius: 50%;">
                      <b>${user.name}</b>
                    </div>
                    <div class="card-body shadow-sm" ">
                      <img src="${userBody.image}" alt="" class="img-fluid">
                      <h6 style="color: gray;">${userBody.created_at}</h6>
                      <h5>addresss</h5>
                      <p>${userBody.body}</p>
                      <hr>
                      <div class="d-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                        </svg>
                        <span>${userBody.created_at}</span>     
                      </div>
                    </div>
                  </div> 
                </div>
              </div>`;
          }
        })
        .catch((error) => {
          console.error('Error fetching user posts:', error);
        });
      
    }
    document.getElementById("home").onclick=function(){
      window.location=`home.html`
    }
    document.getElementById("nav").onclick=function(){
      window.location=`home.html`
    }
    
    
    
    
    
    
  
    getProfileInfo()
   
      getUserPosts();
  
    