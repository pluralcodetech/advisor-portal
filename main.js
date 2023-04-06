
// function to log in advisor
function adminLog(event) {
    event.preventDefault();
    const getEmail = document.getElementById("email").value;
    const getPass = document.getElementById("password").value;

    if (getEmail === "" || getPass === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#25067C'
        })
    }

    else {
        const spinRoll = document.querySelector(".spin");
        spinRoll.style.display = "inline-block";

        const getUniqueId = Math.floor(Math.random() * 1000000);
        localStorage.setItem("unNum", getUniqueId);
        const now = new Date();
        now.setTime(now.getTime() + 1 * 60 * 60 * 1000);
        // now.setTime(now.getTime() + (30 * 1000));
        adValue = getUniqueId;

        document.cookie = "name=" + adValue;
        document.cookie = "expires=" + now.toUTCString() + ";";
        if(localStorage.getItem("cookieKey") === null) {
          localStorage.setItem('cookieKey', document.cookie);
        }
        

        const adminData = new FormData();
        adminData.append("email", getEmail);
        adminData.append("password", getPass);
        adminData.append("id", getUniqueId);


        const adminRequest = {
            method: 'POST',
            body: adminData
        };

        const url = "https://pluralcode.institute/pluralcode_apis/api/login_advisor";

        fetch(url, adminRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.advisor.hasOwnProperty("email")) {
                localStorage.setItem("adminLogin", JSON.stringify(result));
                window.location.href = "dashboard.html";
            }
        })
        .catch(error => {
            console.log('error', error)
            Swal.fire({
                icon: 'warning',
                text: `Network issues ${error}`,
                confirmButtonColor: '#25067C'
            })
            spinRoll.style.display = "none";
        });
    }
}

setTimeout(function destroyCookie() {
    const cookwa = localStorage.getItem("adminLogin");
    const theCook = JSON.parse(cookwa);
    const cookTok = theCook.token;

    const cookHead = new Headers();
    cookHead.append("Authorization", `Bearer ${cookTok}`);

    const getCookie = localStorage.getItem("unNum");
    const cookForm = new FormData();
    cookForm.append("id", getCookie);

    const cookReq = {
        method: 'POST',
        headers: cookHead,
        body: cookForm
    };

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/logout_expired_cookies";
    fetch(url, cookReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if(result.status === "success") {
            localStorage.clear();
            window.location.href = "index.html";
        }
    })
    .catch(error => console.log('error', error));
}, 600000);

// function to get dashboard api
// dashboard api 
function dashBoardDetails() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const totalAdvisor = document.getElementById("adAsign");
    const totalSect = document.getElementById("secHel");
    const totalAdviCom = document.getElementById("adCom");


    const dash = localStorage.getItem("adminLogin");
    const dash2 = JSON.parse(dash);
    const dash3 = dash2.token;

    const dashHead = new Headers();
    dashHead.append("Authorization", `Bearer ${dash3}`);

    const dashReq = {
        method: 'GET',
        headers: dashHead
    };

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/advisor_dashboard_api";
    fetch(url, dashReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        localStorage.setItem("dash", JSON.stringify(result));
        totalAdvisor.innerHTML = result.total_advisory_assigned;
        totalSect.innerHTML = result.total_enrolled;
        totalAdviCom.innerHTML = result.total_interest_form_filled;

        myModal.style.opacity = "none";

    })
    .catch(error => console.log('error', error));
}
dashBoardDetails();

// function to get schedule meeteings
let nextPage;
function getSchedule() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const etdash = localStorage.getItem("adminLogin");
    const cmdash2 = JSON.parse(etdash);
    const cmdash3 = cmdash2.token;

    const cmdashHead = new Headers();
    cmdashHead.append("Authorization", `Bearer ${cmdash3}`);
    
    const adReq = {
        method: 'GET',
        headers: cmdashHead
    };

    let adData = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/scheduled_meetings";
    fetch(url, adReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result.data.map((item) => {
            adData += `
                    <tr>
                    <td>${item.date}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.course_interested_in}</td>
                    <td>${item.schedule}</td>
                    <td>${item.time}</td>
                    <td><button class="re-btn" onclick="rescheduleTime(${item.id})">Reschedule</button></td>
                    <td><a href="view.html?id=${item.id}"><button class="upd">View me</button></a></td>
                    <td><button class="${item.status} adBtn">
                        ${item.status}
                        </button>
                    </td>
                    <td><a href="https://wa.me/234${item.phone_number}" target="_blank"><i class='fab fa-whatsapp' style='color:#0e8115; font-size: 30px;'></i></a></td>
                    <td><button class="upstate-btn" onclick="updateModal(${item.id})">Edit Advisory</button></td>
                    </tr>
                `
            const myTable = document.querySelector(".tableindex");
            myTable.innerHTML = adData;
            myModal.style.display = "none";
        })
        localStorage.setItem("page", `${result.next_page_url}`);
        const nextItem = localStorage.getItem("page");
        nextPage = nextItem;
        const current = document.querySelector(".current-page");
        current.innerHTML = `${result.current_page} of ${result.total}`;
        if (result.prev_page_url === null) {
            const getPrev = document.querySelector(".get-previous");
            getPrev.disabled = true;
        }
    })
    .catch(error => console.log('error', error));
}
getSchedule();

// function to get next page
let previous;
function nextPageItem(event) {
    event.preventDefault();
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const etdash = localStorage.getItem("adminLogin");
    const cmdash2 = JSON.parse(etdash);
    const cmdash3 = cmdash2.token;

    const cmdashHead = new Headers();
    cmdashHead.append("Authorization", `Bearer ${cmdash3}`);
    
    const adReq = {
        method: 'GET',
        headers: cmdashHead
    };

    let adData = [];

    const url = nextPage;
    fetch(url, adReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        nextPage = `${result.next_page_url}`;
        result.data.map((item) => {
            adData += `
                    <tr>
                    <td>${item.date}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.course_interested_in}</td>
                    <td>${item.schedule}</td>
                    <td>${item.time}</td>
                    <td><button class="re-btn" onclick="rescheduleTime(${item.id})">Reschedule</button></td>
                    <td><a href="view.html?id=${item.id}"><button class="upd">View me</button></a></td>
                    <td><button class="${item.status} adBtn">
                        ${item.status}
                        </button>
                    </td>
                    <td><a href="https://wa.me/234${item.phone_number}" target="_blank"><i class='fab fa-whatsapp' style='color:#0e8115; font-size: 30px;'></i></a></td>
                    <td><button class="upstate-btn" onclick="updateModal(${item.id})">Edit Advisory</button></td>
                    </tr>
                `
            const myTable = document.querySelector(".tableindex");
            myTable.innerHTML = adData;
            myModal.style.display = "none";
            const current = document.querySelector(".current-page");
            current.innerHTML = `page ${result.current_page} of ${result.total}`;
            const getPrev = document.querySelector(".get-previous");
            getPrev.disabled = false;
        })
        localStorage.setItem("prev", `${result.prev_page_url}`);
        const prPage = localStorage.getItem("prev");
        previous = prPage;
    })
    .catch(error => console.log('error', error));
}

// function to get previous page
function prevPageItem(event) {
    event.preventDefault();
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const etdash = localStorage.getItem("adminLogin");
    const cmdash2 = JSON.parse(etdash);
    const cmdash3 = cmdash2.token;

    const cmdashHead = new Headers();
    cmdashHead.append("Authorization", `Bearer ${cmdash3}`);
    
    const adReq = {
        method: 'GET',
        headers: cmdashHead
    };

    let adData = [];

    const url = previous;
    fetch(url, adReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        previous = `${result.prev_page_url}`;
        nextPage = `${result.next_page_url}`;
        result.data.map((item) => {
            adData += `
                    <tr>
                    <td>${item.date}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.course_interested_in}</td>
                    <td>${item.schedule}</td>
                    <td>${item.time}</td>
                    <td><button class="re-btn" onclick="rescheduleTime(${item.id})">Reschedule</button></td>
                    <td><a href="view.html?id=${item.id}"><button class="upd">View me</button></a></td>
                    <td><button class="${item.status} adBtn">
                        ${item.status}
                        </button>
                    </td>
                    <td><a href="https://wa.me/234${item.phone_number}" target="_blank"><i class='fab fa-whatsapp' style='color:#0e8115; font-size: 30px;'></i></a></td>
                    <td><button class="upstate-btn" onclick="updateModal(${item.id})">Edit Advisory</button></td>
                    </tr>
                `
            const myTable = document.querySelector(".tableindex");
            myTable.innerHTML = adData;
            myModal.style.display = "none";
            const current = document.querySelector(".current-page");
            current.innerHTML = `page ${result.current_page} of ${result.total}`;
            if (result.prev_page_url === null) {
                const getPrev = document.querySelector(".get-previous");
                getPrev.disabled = true;
            }
        })
        // localStorage.setItem("prev", `${result.prev_page_url}`);
        // const prPage = localStorage.getItem("prev");
        // previous = prPage;
    })
    .catch(error => console.log('error', error));
}

// function to open modal to update advisory details
function updateModal(upId) {

    const upMode = document.getElementById("up-modal");
    upMode.style.display = "block";

    localStorage.setItem("updateId", upId);
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const interest = document.getElementById("interest");
    const taken = document.getElementById("taken");
    const mode = document.getElementById("mode");
    const reason = document.getElementById("reason");
    const scheduleDate = document.getElementById("schedule");
    const scheduleTime = document.getElementById("time");
    const location = document.getElementById("location");
    const job = document.getElementById("job");
    const status = document.querySelector(".status");
    const comment = document.querySelector(".comment");


    const upReq = {
        method: 'GET'
    };

    const url = `https://pluralcode.institute/pluralcode_apis/api/get_advisory_details?id=` + `${upId}`;
    fetch(url, upReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        name.setAttribute("value", `${result.name}`);
        email.setAttribute("value", `${result.email}`);
        phone.setAttribute("value", `${result.phone_number}`);
        interest.setAttribute("value", `${result.course_interested_in}`);
        taken.setAttribute("value", `${result.taken_any_course_before}`);
        mode.setAttribute("value", `${result.mode_of_learning}`);
        reason.setAttribute("value", `${result.reason_for_learning}`);
        // scheduleDate.setAttribute("value", `${result.schedule}`);
        // scheduleTime.setAttribute("value", `${result.time}`);
        location.setAttribute("value", `${result.location}`);
        job.setAttribute("value", `${result.current_job}`);
        status.setAttribute("selected", `${result.status}`);
        comment.value = `${result.advisor_feedback}`;


    })
    .catch(error => console.log('error', error));
}

// close modal for update advisory detals
function upModal() {
    const upMode = document.getElementById("up-modal");
    upMode.style.display = "none";
}

// function to update advisory
function updateStatus(event) {
    event.preventDefault();

    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const upName = document.getElementById("name").value;
    const upEmail = document.getElementById("email").value;
    const upPhone = document.getElementById("phone").value;
    const upAge = document.getElementById("age").value;
    const upInterest = document.getElementById("interest").value;
    const upTaken = document.getElementById("taken").value;
    const upMode = document.getElementById("mode").value;
    const upReason = document.getElementById("reason").value;
    const upScheduleDate = document.getElementById("schedule").value;
    const upScheduleTime = document.getElementById("time");
    const upLocation = document.getElementById("location").value;
    const upJob = document.getElementById("job").value;
    const upStatus = document.querySelector(".status").value;
    const upComment = document.querySelector(".comment").value;

    // console.log(upScheduleTime);
    let timeSplit = upScheduleTime.value.split(':'),hours,minutes,meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
        meridian = 'PM';
        hours -= 12;
    }else if (hours < 12) {
        meridian = 'AM';
        if (hours == 0) {
            hours = 12;
        }else {
            meridian = 'PM';
        }
    }

    let newTime = hours + ':' + minutes + meridian;


    if (upName === "" || upEmail === "" || upPhone === "" || upAge === "" || upInterest === "" || upTaken === "" || upMode === "" || upReason === "" || newTime === "" || upLocation === "" || upJob === "" || upStatus === "" || upComment === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#25067C'
        })
    }

    else {
        const updash = localStorage.getItem("adminLogin");
        const updash2 = JSON.parse(updash);
        const updash3 = updash2.token;

        const upMyId = localStorage.getItem("updateId");

        const upHead = new Headers();
        upHead.append("Authorization", `Bearer ${updash3}`);

        const upForm = new FormData();
        upForm.append("name", upName);
        upForm.append("email", upEmail);
        upForm.append("phone_number", upPhone);
        upForm.append("age", upAge);
        upForm.append("course_interested_in", upInterest);
        upForm.append("taken_any_course_before", upTaken);
        upForm.append("mode_of_learning", upMode);
        upForm.append("reason_for_learning", upReason);
        upForm.append("date", upScheduleDate);
        upForm.append("time", newTime);
        upForm.append("id", upMyId);
        upForm.append("location", upLocation);
        upForm.append("current_job", upJob);
        upForm.append("status", upStatus);
        upForm.append("keynotes", upComment);

        const upMyReq = {
            method: 'POST',
            headers: upHead,
            body: upForm
        };

        const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/update_advisory_details";
        fetch(url, upMyReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#25067C'
                })
                setTimeout(()=> {
                    location.reload();
                }, 3000);
                myModal.style.display = "none";
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful',
                    confirmButtonColor: '#25067C'
                })
                myModal.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }

}

// function to getAdvisory details
function getAdvisoryDetails() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";
    
    const params = new URLSearchParams(window.location.search);
    let getId = params.get('id');


    const openAdReq = {
        method: 'GET'
    };

    let myData = [];

    const url = `https://pluralcode.institute/pluralcode_apis/api/get_advisory_details?id=` + `${getId}`;

    fetch(url, openAdReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        myData += `
                <div class="content">
                    <p>Name:</p>
                    <p>${result.name}</p>
                </div>
                <div class="content">
                    <p>Phone Number:</p>
                    <p>${result.phone_number}</p>
                </div>
                <div class="content">
                    <p>Email:</p>
                    <p>${result.email}</p>
                </div>
                <div class="content">
                    <p>Course Interested In:</p>
                    <p>${result.course_interested_in}</p>
                </div>
                <div class="content">
                    <p>Location:</p>
                    <p>${result.location}</p>
                </div>
                <div class="content">
                    <p>Reason For not workingout:</p>
                    <p>${result.reason_for_not_workingout}</p>
                </div>
                <div class="content">
                    <p>Taken any course before:</p>
                    <p>${result.taken_any_course_before}</p>
                </div>
                <div class="content">
                    <p>Mode of learning:</p>
                    <p>${result.mode_of_learning}</p>
                </div>
                <div class="content">
                    <p>Current Job:</p>
                    <p>${result.current_job}</p>
                </div>
                <div class="content">
                    <p>Reason for Learning:</p>
                    <p>${result.reason_for_learning}</p>
                </div>
                <div class="content">
                  <p>Schedule:</p>
                  <p>${result.schedule}</p>
                </div>
                <div class="content">
                  <p>Status:</p>
                  <p><button class="${result.status}">${result.status}</button></p>
                </div>
                <form class="mt-5">
                <select class="shape status">
                <option>..choose status..</option>
                <option value="interested">Interested</option>
                <option value="not_interested">Not Interested</option>
                <option value="unreachable">Unreachable</option>
                <option value="undecided">Undecided</option>
                <option value="next cohort">Next Cohort</option>
                <option value="pending">Pending</option>
                <option value="enrolled">Enrolled</option>
                </select>
                <textarea placeholder="Enter Remarks" class="shape2 comment"></textarea>
                   <center>
                      <button class="update mt-3" onclick="changeAdvisoryStatus(event)">Update</button>
                   </center>
                </form>
            </div>
            `
        
            
            const colIt = document.querySelector(".box-student");
            colIt.innerHTML = myData;

            const theComment = document.querySelector(".comment");
            theComment.value = `${result.advisor_feedback}`;
            myModal.style.display = "none";
    })
    .catch(error => console.log('error', error));
}
getAdvisoryDetails();

function rescheduleTime(reId) {

    const myModal = document.getElementById("re-modal");
    myModal.style.display = "block";

    localStorage.setItem("getDule", reId);

}

function closehModal() {
    const myModal = document.getElementById("re-modal");
    myModal.style.display = "none";
}

// function to set time and assign time
function assignTimeSlot(event) {
    event.preventDefault();

    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const setDate = document.querySelector(".myDate").value;
    const setTime = document.querySelector(".myTime");

    let timeSplit = setTime.value.split(':'),hours,minutes,meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
        meridian = 'PM';
        hours -= 12;
    }else if (hours < 12) {
        meridian = 'AM';
        if (hours == 0) {
            hours = 12;
        }else {
            meridian = 'PM';
        }
    }

    let newTime = hours + ':' + minutes + meridian;

    if (setDate === "" || newTime === "") {
        Swal.fire({
            icon: 'info',
            text: 'Please enter a date',
            confirmButtonColor: '#25067C'
        })
    }
    else {
        const getId = localStorage.getItem("getDule");

        const resGet = localStorage.getItem("adminLogin");
        const reGet = JSON.parse(resGet);
        const reTok = reGet.token;

        const relHead = new Headers();
        relHead.append("Authorization", `Bearer ${reTok}`);

        const reForm = new FormData();
        reForm.append("id", getId);
        reForm.append("date", setDate);
        reForm.append("time", newTime);

        const reReq = {
            method: 'POST',
            headers: relHead,
            body: reForm
        };

        const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/re_schedule_student";
        fetch(url, reReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.status}`,
                    confirmButtonColor: '#25067C'
                })
                setTimeout(()=> {
                    location.reload();
                }, 5000);

                myModal.style.display = "none";
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessfull',
                    confirmButtonColor: '#25067C'
                })
                myModal.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}

// function to change advisory status
function changeAdvisoryStatus(event) {
    event.preventDefault();

    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const params = new URLSearchParams(window.location.search);
    let getId = params.get('id');
    console.log(getId)

    const getStatus = document.querySelector(".status").value;
    const getComment = document.querySelector(".comment").value;

    if (getStatus === "" || getComment === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#25067C'
        })
    }
    else {
        const changeLoc = localStorage.getItem("adminLogin");
        const loc = JSON.parse(changeLoc);
        const locTok = loc.token;

        const locHead = new Headers();
        locHead.append("Authorization", `Bearer ${locTok}`);

        const locForm = new FormData();
        locForm.append("id", getId);
        locForm.append("keynotes", getComment);
        locForm.append("status", getStatus);
        

        const locReq = {
            method: 'POST',
            headers: locHead,
            body: locForm
        };

        const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/update_advisory_status";
        fetch(url, locReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: 'Successful',
                    confirmButtonColor: '#25067C'
                })
                setTimeout(()=> {
                    location.reload();
                    myModal.style.display = "none";
                }, 5000);
            }
            else {
                Swal.fire({
                    icon: 'success',
                    text: 'Unsuccessful',
                    confirmButtonColor: '#25067C'
                })
                myModal.style.display = "none";
            }
        })
        .catch(error => {
            console.log('error', error)
            // window.location.href = "adminlog.html";
        });
    }
}

// function to display enrolled students
function getEnrolled() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const enToken = localStorage.getItem("adminLogin");
    const token = JSON.parse(enToken);
    const letToken = token.token;

    const leHeader = new Headers();
    leHeader.append("Authorization", `Bearer ${letToken}`);

    const enrolledRequest = {
        method: 'GET',
        headers: leHeader
    };

    let dataItem = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/enrolled_student";
    
    fetch(url, enrolledRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result.map((item) => {
            dataItem += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.date}</td>
                    <td>${item.mode_of_learning}</td>
                    <td>${item.course_of_interest}</td>
                </tr>
               `
            const tableInfo = document.querySelector(".tableData");
            tableInfo.innerHTML = dataItem;
            myModal.style.display = "none";
        })
    })
    .catch(error => console.log('error', error));
}
getEnrolled();

function courses() {
    const courReq = {
        method: 'GET'
    };

    let courData = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/getcourses";

    fetch(url, courReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        localStorage.setItem("getCourse", JSON.stringify(result));
        
        result.map((item)=> {
            courData += `
            <option value="${item.name}">${item.name}</option>
            `
        })
        const theCourse = document.querySelector(".letcourse");
        theCourse.innerHTML = courData;
    })
    .catch(error => console.log('error', error));
}
courses();

// Function to get course 
function getTypeCourse(event) {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const courseName = event.currentTarget.value;
    const dataTok = localStorage.getItem("adminLogin");
    const theData = JSON.parse(dataTok);
    const tokenData = theData.token;

    const dataHeader = new Headers();
    dataHeader.append("Authorization", `Bearer ${tokenData}`);

    const courForm = new FormData();
    courForm.append("course", courseName);

    const dataReq = {
        method: 'POST',
        headers: dataHeader,
        body: courForm
    };

    let courseData = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/search_enrollments";

    fetch(url, dataReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const tableInfo = document.querySelector(".tableData");
        if (result.length === 0) {
            tableInfo.innerHTML = `
               <h2 class="text-center">No Records found on this course</h2>
            `
            myModal.style.display = "none";
        }
        else {
            result.map((item) => {
                courseData += `
                    <tr>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.date}</td>
                    <td>${item.mode_of_learning}</td>
                    <td>${item.course_of_interest}</td>
                </tr>
                `
                tableInfo.innerHTML = courseData;
                myModal.style.display = "none";
            })
        }
    })
    .catch(error => console.log('error', error));
}

// Function to search by Name
function searchName(event) {
    event.preventDefault();
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const myForm = document.querySelector(".theForm");
    const nameSearch = document.querySelector(".nsearch").value;
    if (nameSearch === "") {
        Swal.fire({
            icon: 'info',
            text: 'please enter a search value!',
            confirmButtonColor: '#25067C'
        })
    }

    else {
        const myToken = localStorage.getItem("adminLogin");
        const theToken = JSON.parse(myToken);
        const token = theToken.token;

        const nameHeader = new Headers();
        nameHeader.append("Authorization", `Bearer ${token}`);

        const searchName = new FormData();
        searchName.append("name", nameSearch);

        const nameRequest = {
            method: 'POST',
            headers: nameHeader,
            body: searchName
        };

        let nameData = [];

        const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/search_enrollments";
        fetch(url, nameRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            const tableInfo = document.querySelector(".tableData");
            if (result.length === 0) {
                tableInfo.innerHTML = `
                  <h2 class="text-center">No Records found on this name</h2>
                `
                myForm.reset();
                myModal.style.display = "none";
            }
            else {
                result.map((item) => {
                    nameData += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.phone_number}</td>
                        <td>${item.date}</td>
                        <td>${item.mode_of_learning}</td>
                        <td>${item.course_of_interest}</td>
                    </tr>
                    `
                    tableInfo.innerHTML = nameData;
                    myModal.style.display = "none";
                })
                myForm.reset();
            }
        })
        .catch(error => console.log('error', error));
    }
}

// function to search by date
function searchDate() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const dateTok = localStorage.getItem("adminLogin");
    const dk = JSON.parse(dateTok);
    const dateToken = dk.token;

    const myInput = document.querySelector(".start").value;
    const myInput2 = document.querySelector(".end").value;

    const dateHeader = new Headers();
    dateHeader.append("Authorization", `Bearer ${dateToken}`);

    const enrolForm = new FormData();
    enrolForm.append("start_date", myInput);
    enrolForm.append("end_date", myInput2);

    const dateReq = {
        method: 'POST',
        headers: dateHeader,
        body: enrolForm
    };

    let dateData = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/search_enrollments";

    fetch(url, dateReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const tableInfo = document.querySelector(".tableData");
        if (result.length === 0) {
            tableInfo.innerHTML = `
               <h2 class="text-center">No Records found on this date</h2>
            `
            myModal.style.display = "none";
        }
        else {
            result.map((item) => {
                dateData += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.phone_number}</td>
                        <td>${item.date}</td>
                        <td>${item.mode_of_learning}</td>
                        <td>${item.course_of_interest}</td>
                    </tr>
                `
                tableInfo.innerHTML = dateData;
                myModal.style.display = "none";
    
            })
        }
    })
    .catch(error => console.log('error', error));
}

// function to search advisory by status
function searchStatusAd() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const currentStatus = document.querySelector(".shape").value;
    const cuTok = localStorage.getItem("adminLogin");
    const cudk = JSON.parse(cuTok);
    const cuToken = cudk.token;

    const cuHeader = new Headers();
    cuHeader.append("Authorization", `Bearer ${cuToken}`);

    const cuForm = new FormData();
    cuForm.append("status", currentStatus);

    const cuReq = {
        method: 'POST',
        headers: cuHeader,
        body: cuForm
    };

    let cuData = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/advisor_search_advisory_table";
    fetch(url, cuReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const cuInfo = document.querySelector(".tableindex");
        if (result.length === 0) {
            cuInfo.innerHTML = `
               <h2 class="text-center">No Records found on this status</h2>
            `
            myModal.style.display = "none";
        }
        else {
            result.map((item) => {
                cuData += `
                <tr>
                <td>${item.date}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone_number}</td>
                <td>${item.course_interested_in}</td>
                <td>${item.schedule}</td>
                <td>${item.time}</td>
                <td><button class="re-btn" onclick="rescheduleTime(${item.id})">Reschedule</button></td>
                <td><a href="view.html?id=${item.id}"><button class="upd">View me</button></a></td>
                <td><button class="${item.status} adBtn">
                    ${item.status}
                    </button>
                </td>
                <td><a href="https://wa.me/234${item.phone_number}"><i class='fab fa-whatsapp' style='color:#0e8115; font-size: 30px;'></i></a></td>
                <td><button class="upstate-btn" onclick="updateModal(${item.id})">Edit Advisory</button></td>
                </tr>
                `
                cuInfo.innerHTML = cuData;
                myModal.style.display = "none";
           })
        }
    })
    .catch(error => console.log('error', error));
}

// function to display interested student
function getInterest() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";


    const getToken = localStorage.getItem("adminLogin");
    const theToken = JSON.parse(getToken);
    const token = theToken.token;

    const getHeader = new Headers();
    getHeader.append("Authorization", `Bearer ${token}`);

    const enrolledRequest = {
        method: 'GET',
        headers: getHeader
    };

    let dataItem = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/interested_formstudents";
    
    fetch(url, enrolledRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const tableInfo = document.querySelector(".tableInterest");
        if (result.length === 0) {
            tableInfo.innerHTML = `
               <h2 class="text-center">No Records found on this date</h2>
            `
            myModal.style.display = "none";

        }
        else {
            result.map((item) => {
                dataItem += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.phone_number}</td>
                        <td>${item.date}</td>
                        <td>${item.mode_of_learning}</td>
                        <td>${item.course_of_interest}</td>
                    </tr>
                `
                tableInfo.innerHTML = dataItem;
                myModal.style.display = "none";
    
            })
        }
    })
    .catch(error => console.log('error', error));
}
getInterest()

// function to search  interest by name
function searchName2(event) {
    event.preventDefault();
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const nameIt = document.querySelector(".nsearch2").value;
    console.log(nameIt);
    if (nameIt === "") {
        Swal.fire({
            icon: 'info',
            text: 'Field is required',
            confirmButtonColor: '#25067C'
        })
    }
    else {
        const dateTok = localStorage.getItem("adminLogin");
        const dk = JSON.parse(dateTok);
        const dateToken = dk.token;

        const dateHeader = new Headers();
        dateHeader.append("Authorization", `Bearer ${dateToken}`);

        const inForm = new FormData();
        inForm.append("name", nameIt);

        const dateReq = {
            method: 'POST',
            headers: dateHeader,
            body: inForm
        };

        let dateData = [];

        const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/search_interestform";

        fetch(url, dateReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            const tableInfo = document.querySelector(".tableInterest");
            if (result.length === 0) {
                tableInfo.innerHTML = `
                <h2 class="text-center">No Records found on this date</h2>
                `
                myModal.style.display = "none";
            }
            else {
                result.map((item) => {
                    dateData += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.phone_number}</td>
                        <td>${item.date}</td>
                        <td>${item.mode_of_learning}</td>
                        <td>${item.course_of_interest}</td>
                   </tr>
                    `
                    tableInfo.innerHTML = dateData;
                    myModal.style.display = "none";
        
                })
            }
        })
        .catch(error => console.log('error', error));
    }
}

// function to search by date
function searchDate2() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const daok = localStorage.getItem("adminLogin");
    const dk = JSON.parse(daok);
    const dToken = dk.token;

    const myInput = document.querySelector(".g1").value;
    const myInput2 = document.querySelector(".g2").value;

    const dHeader = new Headers();
    dHeader.append("Authorization", `Bearer ${dToken}`);

    const enrolForm2 = new FormData();
    enrolForm2.append("start_date", myInput);
    enrolForm2.append("end_date", myInput2);

    const dateReq = {
        method: 'POST',
        headers: dHeader,
        body: enrolForm2
    };

    let dateData2 = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/search_interestform";

    fetch(url, dateReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const tableInfo = document.querySelector(".tableInterest");
        if (result.length === 0) {
            tableInfo.innerHTML = `
               <h2 class="text-center">No Records found on this date</h2>
            `
            myModal.style.display = "none";
        }
        else {
            result.map((item) => {
                dateData2 += `
                    <tr>
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.phone_number}</td>
                        <td>${item.date}</td>
                        <td>${item.mode_of_learning}</td>
                        <td>${item.course_of_interest}</td>
                    </tr>
                </tr>
                `
                tableInfo.innerHTML = dateData2;
                myModal.style.display = "none";
    
            })
        }
    })
    .catch(error => console.log('error', error));
}

// funtion to show courses for interest
function courses2() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const courReq = {
        method: 'GET'
    };

    let courData = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/getcourses";
    fetch(url, courReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        localStorage.setItem("getCourse", JSON.stringify(result));
        
        result.map((item)=> {
            courData += `
            <option value="${item.name}">${item.name}</option>
            `
            myModal.style.display = "none";
        })
        const theCourse = document.querySelector(".letcourse2");
        theCourse.innerHTML = courData;
    })
    .catch(error => console.log('error', error));
}
courses2();

// Function to get course 
function getTypeCourse2(event) {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const courseName2 = event.currentTarget.value;
    const dataTok2 = localStorage.getItem("adminLogin");
    const theData2 = JSON.parse(dataTok2);
    const tokenData2 = theData2.token;

    const dataHeader2 = new Headers();
    dataHeader2.append("Authorization", `Bearer ${tokenData2}`);

    const courForm2 = new FormData();
    courForm2.append("course", courseName2);

    const dataReq = {
        method: 'POST',
        headers: dataHeader2,
        body: courForm2
    };

    let courseData2 = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/search_interestform";

    fetch(url, dataReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const tableInfo = document.querySelector(".tableInterest");
        if (result.length === 0) {
            tableInfo.innerHTML = `
               <h2 class="text-center">No Records found on this course</h2>
            `
            myModal.style.display = "none";
        }
        else {
            result.map((item) => {
                courseData2 += `
                    <tr>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.date}</td>
                    <td>${item.mode_of_learning}</td>
                    <td>${item.course_of_interest}</td>
                </tr>
                `
                tableInfo.innerHTML = courseData2;
                myModal.style.display = "none";
            })
        }
    })
    .catch(error => console.log('error', error));
}

// function to search by Adviso list by name
function searchAdbyName(event) {
    event.preventDefault();
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const searchNa = document.querySelector(".myname").value;
    console.log(searchNa);
    if (searchNa === "") {
        Swal.fire({
            icon: 'info',
            text: 'this field is required',
            confirmButtonColor: '#0C1E5B'
        })
    }

    else {
        const naDet = localStorage.getItem("adminLogin");
        const naLog = JSON.parse(naDet);
        const naTok = naLog.token;
        
        const naHeader = new Headers();
        naHeader.append("Authorization", `Bearer ${naTok}`);

        const naForm = new FormData();
        naForm.append("name", searchNa);

        const naReq = {
            method: 'POST',
            headers: naHeader,
            body: naForm
        };

        let nameData = [];

        const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/advisor_search_advisory_table";
        fetch(url, naReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            const myTable = document.querySelector(".tableindex");
            if (result.length === 0) {
                myTable.innerHTML = `
                   <h2 class="text-center">No Records found on this course</h2>
                `
                myModal.style.display = "none";
            }
            else {
                result.map((item) => {
                    nameData += `
                    <tr>
                    <td>${item.date}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.course_interested_in}</td>
                    <td>${item.schedule}</td>
                    <td>${item.time}</td>
                    <td><button class="re-btn" onclick="rescheduleTime(${item.id})">Reschedule</button></td>
                    <td><a href="view.html?id=${item.id}"><button class="upd">View me</button></a></td>
                    <td><button class="${item.status} adBtn">
                        ${item.status}
                        </button>
                    </td>
                    <td><a href="https://wa.me/234${item.phone_number}"><i class='fab fa-whatsapp' style='color:#0e8115; font-size: 30px;'></i></a></td>
                    <td><button class="upstate-btn" onclick="updateModal(${item.id})">Edit Advisory</button></td>
                    </tr>
                    `
                    myTable.innerHTML = nameData;
                    myModal.style.display = "none";
               })
            }
            
        })
        .catch(error => console.log('error', error));
    }
    
}

// function for searching for current date
function searchByToday(event) {
    event.preventDefault();

    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const getToday = document.querySelector(".today").value;
    console.log(getToday);

    const toDet = localStorage.getItem("adminLogin");
    const toLog = JSON.parse(toDet);
    const toTok = toLog.token;

    const toHeader = new Headers();
    toHeader.append("Authorization", `Bearer ${toTok}`);
    
    const toForm = new FormData();
    toForm.append("schedule_date", getToday);

    const toReq = {
        method: 'POST',
        headers: toHeader,
        body: toForm
    };

    let todayData = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/advisor_search_advisory_table";
    fetch(url, toReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const myToday = document.querySelector(".tableindex");
        if (result.length === 0) {
            myToday.innerHTML = `
                <h2 class="text-center">No Records found on this course</h2>
            `
            myModal.style.display = "none";
        }
        else {
            result.map((item) => {
                todayData += 
               `
               <tr>
                <td>${item.date}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone_number}</td>
                <td>${item.course_interested_in}</td>
                <td>${item.schedule}</td>
                <td>${item.time}</td>
                <td><button class="re-btn" onclick="rescheduleTime(${item.id})">Reschedule</button></td>
                <td><a href="view.html?id=${item.id}"><button class="upd">View me</button></a></td>
                <td><button class="${item.status} adBtn">
                    ${item.status}
                    </button>
                </td>
                <td><a href="https://wa.me/234${item.phone_number}"><i class='fab fa-whatsapp' style='color:#0e8115; font-size: 30px;'></i></a></td>
                <td><button class="upstate-btn" onclick="updateModal(${item.id})">Edit Advisory</button></td>
                </tr>
                `
                 myToday.innerHTML = todayData;
                myModal.style.display = "none";
           })
        }
    })
    .catch(error => console.log('error', error));
}

// function to get date range
function searchTheDate(event) {
    event.preventDefault();
    
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const first = document.querySelector(".firstValue").value;
    const second = document.querySelector(".secondValue").value;

    if (first === "" || second === "") {
        Swal.fire({
            icon: 'info',
            text: 'these field is required',
            confirmButtonColor: '#0C1E5B'
        })
    }

    else {
        const daDet = localStorage.getItem("adminLogin");
        const daLog = JSON.parse(daDet);
        const daTok = daLog.token;
        
        const daHeader = new Headers();
        daHeader.append("Authorization", `Bearer ${daTok}`);

        const daForm = new FormData();
        daForm.append("start_date", first);
        daForm.append("end_date", second);

        const daReq = {
            method: 'POST',
            headers: daHeader,
            body: daForm
        };

        let daData = [];

        const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/advisor_search_advisory_table";
        fetch(url, daReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            const myTable2 = document.querySelector(".tableindex");
            if (result.length === 0) {
                myTable2.innerHTML = `
                   <h2 class="text-center">No Records found on this course</h2>
                `
                myModal.style.display = "none";
            }
            else {
                result.map((item) => {
                    daData += 
                   `
                   <tr>
                    <td>${item.date}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.course_interested_in}</td>
                    <td>${item.schedule}</td>
                    <td>${item.time}</td>
                    <td><button class="re-btn" onclick="rescheduleTime(${item.id})">Reschedule</button></td>
                    <td><a href="view.html?id=${item.id}"><button class="upd">View me</button></a></td>
                    <td><button class="${item.status} adBtn">
                        ${item.status}
                        </button>
                    </td>
                    <td><a href="https://wa.me/234${item.phone_number}"><i class='fab fa-whatsapp' style='color:#0e8115; font-size: 30px;'></i></a></td>
                    <td><button class="upstate-btn" onclick="updateModal(${item.id})">Edit Advisory</button></td>
                    </tr>
                    `
                     myTable2.innerHTML = daData;
                    myModal.style.display = "none";
               })
            }
        })
        .catch(error => console.log('error', error));
    }

}

// funtion to show courses for interest
function courses3() {
    const coDet = localStorage.getItem("adminLogin");
    const coLog = JSON.parse(coDet);
    const coTok = coLog.token;
        
    const coHeader = new Headers();
    coHeader.append("Authorization", `Bearer ${coTok}`);

    const coReq = {
        method: 'GET',
        headers: coHeader
    };

    let coData = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/advisor_courses";
    fetch(url, coReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        localStorage.setItem("getCourse", JSON.stringify(result));
        
        result.map((item)=> {
            coData += `
            <option value="${item.name}">${item.name}</option>
            `
        })
        const theCourse2 = document.querySelector(".spincourse");
        theCourse2.innerHTML = coData;
    })
    .catch(error => console.log('error', error));
}
courses3();


// funtion to show courses for interest
function coursesProfile() {
    const coDet = localStorage.getItem("adminLogin");
    const coLog = JSON.parse(coDet);
    const coTok = coLog.token;
        
    const coHeader = new Headers();
    coHeader.append("Authorization", `Bearer ${coTok}`);

    const coReq = {
        method: 'GET',
        headers: coHeader
    };

    let coData = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/advisor_courses";
    fetch(url, coReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        localStorage.setItem("getCourse", JSON.stringify(result));
        
        result.map((item)=> {
            coData += `
            <option value="${item.name}">${item.name}</option>
            `
        })
        const theCourse2 = document.querySelector(".profile");
        theCourse2.innerHTML = coData;
    })
    .catch(error => console.log('error', error));
}
coursesProfile();

// function to get advisor dashboard course
function visorCourse(event) {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const course = event.currentTarget.value;
    const coTok = localStorage.getItem("adminLogin");
    const gData = JSON.parse(coTok);
    const goData = gData.token;

    const gHeader = new Headers();
    gHeader.append("Authorization", `Bearer ${goData}`);

    const coForm = new FormData();
    coForm.append("course", course);

    const gReq = {
        method: 'POST',
        headers: gHeader,
        body: coForm
    };

    let Data = [];

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/advisor_search_advisory_table";
    fetch(url, gReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const myTable2 = document.querySelector(".tableindex");
        if (result.length === 0) {
            myTable2.innerHTML = `
               <h2 class="text-center">No Records found on this course</h2>
            `
            myModal.style.display = "none";
        }
        else {
            result.map((item) => {
               Data += `
               <tr>
               <td>${item.date}</td>
               <td>${item.name}</td>
               <td>${item.email}</td>
               <td>${item.phone_number}</td>
               <td>${item.course_interested_in}</td>
               <td>${item.schedule}</td>
               <td>${item.time}</td>
               <td><button class="re-btn" onclick="rescheduleTime(${item.id})">Reschedule</button></td>
               <td><a href="view.html?id=${item.id}"><button class="upd">View me</button></a></td>
               <td><button class="${item.status} adBtn">
                   ${item.status}
                   </button>
               </td>
               <td><a href="https://wa.me/234${item.phone_number}"><i class='fab fa-whatsapp' style='color:#0e8115; font-size: 30px;'></i></a></td>
               <td><button class="upstate-btn" onclick="updateModal(${item.id})">Edit Advisory</button></td>
               </tr>
                    `
                    myTable2.innerHTML = Data;
                    myModal.style.display = "none";
            })
        }
        
    })
    .catch(error => console.log('error', error));
}

// functionto load details
function loadDetails() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const getDetails = localStorage.getItem("dash");
    const getIt = JSON.parse(getDetails);
    const theGeat = getIt.enrollment_form_link;
    const geat = getIt.interested_form_link;

    // theGeat.setAttribute("href", "https://pluralcode.academy/payment/index.html?reference=62aad875e19cb");
    // geat.setAttribute("href", "https://pluralcode.academy/payment/interest.html?reference=62aad875e19cb");

    const getBox = document.querySelector(".aty");
    const box2 = document.querySelector(".aty2");

    getBox.innerHTML = theGeat;
    box2.innerHTML = geat;

    myModal.style.display = "none";    
}
loadDetails();

// function to copy text
function getTheText(event) {
    event.preventDefault();
    let copyText = document.querySelector(".aty").textContent;
    navigator.clipboard.writeText(copyText);
    console.log(copyText)
}

// function to copy text
function getTheText2(event) {
    event.preventDefault();
    let copyText2 = document.querySelector(".aty2").textContent;
    navigator.clipboard.writeText(copyText2);
    console.log(copyText2)
}

// redirect to login page
function gotoLoginPage(event) {
    event.preventDefault();

    window.location.href = "index.html";
}


// function for weekly summary
function getWeekly() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const coTok = localStorage.getItem("adminLogin");
    const gData = JSON.parse(coTok);
    const goData = gData.token;

    const gw = new Headers();
    gw.append("Authorization", `Bearer ${goData}`);

    const gwReq = {
        method: 'GET',
        headers: gw
    };

    let gwData = [];

    const url = "https://pluralcode.academy/pluralcode_apis/api/advisor/get_advisor_weekly_summary";

    fetch(url, gwReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const tableWeek = document.querySelector(".table-week");
        if (result.length === 0) {
            tableWeek.innerHTML = `
               <h2 class="text-center">No Records found on this course</h2>
            `
            myModal.style.display = "none";
        }
        else {
            result.map((item) => {
                gwData += `
                  <tr>
                    <td>${item.course}</td>
                    <td>${item.total_visit_booked}</td>
                    <td>${item.total_weekly_count}</td>
                  </tr>
                `
                tableWeek.innerHTML = gwData;
                myModal.style.display = "none";
            })
        }
    })
    .catch(error => console.log('error', error));

}
getWeekly();


// function for booked visit
let pageNext;
function bookVisit() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const coTok = localStorage.getItem("adminLogin");
    const gData = JSON.parse(coTok);
    const goData = gData.token;

    const bv = new Headers();
    bv.append("Authorization", `Bearer ${goData}`);

    const bvReq = {
        method: 'GET',
        headers: bv
    };

    let bvData = [];

    const url = "https://pluralcode.academy/pluralcode_apis/api/advisor/get_booked_visit_data";

    fetch(url, bvReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const tableVisit = document.querySelector(".table-visit");
        const belu = document.querySelector(".belu");
        if (result.data.length === 0) {
            tableVisit.innerHTML = `
               <h2 class="text-center">No Records found for visits</h2>
            `
            myModal.style.display = "none";
            belu.style.display = "none";
        }
        else {
            result.data.map((item) => {
                bvData += `
                  <tr>
              <td>${item.name}</td>
              <td>${item.email}</td>
              <td>${item.phone_number}</td>
              <td>${item.time}</td>
              <td>${item.date}</td>
              <td>${item.course}</td>
              <td>${item.month}</td>
              <td>${item.year}</td>
              <td>${item.school}</td>
              <tr/>

                `
                tableVisit.innerHTML = bvData;
                myModal.style.display = "none";
            })
            if (result.next_page_url === null) {
                belu.style.display = "none";
            }
              else {
                belu.style.display = "block";
            }
            localStorage.setItem("newPage", `${result.next_page_url}`);
            const nextItem = localStorage.getItem("newPage");
            pageNext = nextItem;
            const current = document.querySelector(".current-page");
            current.innerHTML = `${result.current_page} of ${result.total}`;
            if (result.prev_page_url === null) {
                const getPrev = document.querySelector(".get-previous");
                getPrev.disabled = true;
            }

        }
    })
    .catch(error => console.log('error', error));
}
bookVisit();

// function to get next Page
let pagePrevious
function pageNextItem(event) {
    event.preventDefault();

    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const etdash = localStorage.getItem("adminLogin");
    const cmdash2 = JSON.parse(etdash);
    const cmdash3 = cmdash2.token;

    const nv = new Headers();
    nv.append("Authorization", `Bearer ${cmdash3}`);

    const nvReq = {
        method: 'GET',
        headers: nv
    };

    let nvData = [];

    const url = pageNext;
    fetch(url, nvReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        pageNext = `${result.next_page_url}`;
        result.data.map((item) => {
            nvData += `
              <tr>
              <td>${item.name}</td>
              <td>${item.email}</td>
              <td>${item.phone_number}</td>
              <td>${item.time}</td>
              <td>${item.date}</td>
              <td>${item.course}</td>
              <td>${item.month}</td>
              <td>${item.year}</td>
              <td>${item.school}</td>
              <tr/>

            `
            tableVisit.innerHTML = nvData;
            myModal.style.display = "none";
            belu.style.display = "block";
            const current = document.querySelector(".current-page");
            current.innerHTML = `page ${result.current_page} of ${result.total}`;
            const getPrev = document.querySelector(".get-previous");
            getPrev.disabled = false;
        })
        localStorage.setItem("prevMe", `${result.prev_page_url}`);
        const prPage = localStorage.getItem("prevMe");
        pagePrevious = prPage;

    })
    .catch(error => console.log('error', error));
}

// function to get previous
function pagePrevItem(event) {
    event.preventDefault();
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const etdash = localStorage.getItem("adminLogin");
    const cmdash2 = JSON.parse(etdash);
    const cmdash3 = cmdash2.token;

    const pv = new Headers();
    pv.append("Authorization", `Bearer ${cmdash3}`);

    const pvReq = {
        method: 'GET',
        headers: pv
    };

    let pvData = [];
    const url = pagePrevious;

    fetch(url, pvReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        pagePrevious = `${result.prev_page_url}`;
        pageNext = `${result.next_page_url}`;
        result.data.map((item) => {
            pvData += `
              <tr>
              <td>${item.name}</td>
              <td>${item.email}</td>
              <td>${item.phone_number}</td>
              <td>${item.time}</td>
              <td>${item.date}</td>
              <td>${item.course}</td>
              <td>${item.month}</td>
              <td>${item.year}</td>
              <td>${item.school}</td>
              <tr/>

            `
            tableVisit.innerHTML = pvData;
            myModal.style.display = "none";
            belu.style.display = "block";
            const current = document.querySelector(".current-page");
            current.innerHTML = `page ${result.current_page} of ${result.total}`;
            if (result.prev_page_url === null) {
                const getPrev = document.querySelector(".get-previous");
                getPrev.disabled = true;
            }
            // this is to disable next button
            else if (result.next_page_url === null) {
                const getNext = document.querySelector(".get-next");
                getNext.disabled = true;
            }
        })
    })
    .catch(error => console.log('error', error));
}

// function to create users profile
function viewModal(event) {
    event.preventDefault();

    const userModal = document.getElementById("user-modal");
    userModal.style.display = "block";
}

function bodal() {
    const userModal = document.getElementById("user-modal");
    userModal.style.display = "none";
}

// function to create prospect
function createProspect(event) {
    event.preventDefault();

    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    const etdash = localStorage.getItem("adminLogin");
    const cmdash2 = JSON.parse(etdash);
    const cmdash3 = cmdash2.token;

    const un = document.getElementById("uname").value;
    const ue = document.getElementById("uemail").value;
    const up = document.getElementById("uphone").value;
    const ua = document.getElementById("uage").value;
    const ui = document.getElementById("uinterest").value;
    const ul = document.getElementById("ulocation").value;

    if (un === "" || ue === "" || up === "" || ua === "" || ui === "" || ul === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required...',
            confirmButtonColor: '#0C1E5B'
        })
        getSpin.style.display = "none";
    }

    else {
        const pv = new Headers();
        pv.append("Authorization", `Bearer ${cmdash3}`);

        const pvReq = {
            method: 'GET',
            headers: pv,
            // body: myform
        };

        const url = `https://pluralcode.academy/pluralcode_apis/api/bot_create_advisory?name=${un}&email=${ue}&phone_number=${up}&age=${ua}&course_interested_in=${ui}&location=${ul}`;
        fetch(url, pvReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#0C1E5B'
                })

                setTimeout(() => {
                    location.reload();
                }, 3000)
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful',
                    confirmButtonColor: '#0C1E5B'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => {
            console.log('error', error)
            if (error) {
                Swal.fire({
                    icon: 'info',
                    text: error,
                    confirmButtonColor: '#0C1E5B'
                })
                getSpin.style.display = "none";
            }
        });
    }

}
// function logout
function logAdminOut(event) {
    event.preventDefault();

    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";

    const logDet = localStorage.getItem("adminLogin");
    const delLog = JSON.parse(logDet);
    const delTok = delLog.token;

    const delHeader = new Headers();
    delHeader.append("Authorization", `Bearer ${delTok}`)

    const logReq = {
        method: 'GET',
        headers: delHeader
    };

    const url = "https://pluralcode.institute/pluralcode_apis/api/advisor/logout";
    fetch(url, logReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)

        if (result.message === "success") {
            Swal.fire({
                icon: 'success',
                text: `${result.message}`,
                confirmButtonColor: '#25067C'
            })

            setTimeout(()=> {
                localStorage.clear();
                window.location.href = "index.html";
            }, 3000);
            myModal.style.display = "none";
        }else {
            Swal.fire({
                icon: 'info',
                text: 'Log out Unsuccessful',
                confirmButtonColor: '#25067C'
            })
            myModal.style.display = "none";
        }
        
    })
    .catch(error => console.log('error', error));
}