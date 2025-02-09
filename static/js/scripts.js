// Function to get CSRF token from the cookie
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie starts with the desired name
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
};

// Get the CSRF token
const csrftoken = getCookie("csrftoken");

// Function random animated stars
const createStars = () => {
    for (let i = 0; i < 1000; i++) {
        let star = document.createElement("div");
        star.className = "star";
        star.style.top = Math.random() * 99.5 + "vh";
        star.style.left = Math.random() * 99.5 + "vw";
        star.style.animationDuration = Math.random() * 2 + 0.75 + "s";
        star.style.zIndex = "1";
        document.body.appendChild(star);
    }
};

// Function user input & update chat box
const sendMessage = (button) => {
    let input = document.getElementById("user-input").value;
    if (input.trim() !== "") {
        // Append user message
        let newMessage = document.createElement("div");
        newMessage.classList.add("message-box");
        newMessage.textContent = input;
        document.getElementById("chat-content").appendChild(newMessage);
        document.getElementById("user-input").value = "";
        document.getElementById("user-input").focus();
        console.log(input);
        getResponse(input);
    }
};

// Function get chatbot response
const getResponse = (query) => {
    // Send the POST request
    fetch("/response/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ query: query }),
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result.response);
            // Append chatbot message
            let newResponse = document.createElement("div");
            newResponse.classList.add("message-bot");
            newResponse.textContent = result.response;
            document.getElementById("chat-content").appendChild(newResponse);
        });
};
