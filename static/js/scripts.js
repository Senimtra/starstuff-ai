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
const sendMessage = () => {
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
            console.log(result.response[0]);
            // Append chatbot message
            let newResponse = document.createElement("div");
            newResponse.classList.add("message-bot");
            newResponse.textContent = result.response[0];
            document.getElementById("chat-content").appendChild(newResponse);
            // Execute image insertion
            if (result.response[1]) {
                insertImages(result.response[1]);
            }
        });
};

// Test messages
const testMessagesTexts = [
    '"Hello. I do have a question about the universe."',
    '"How hot is it on the sun?"',
    '"And on Pluto?"',
    '"Would I be able to live on it?"',
    '"How about brown dwars? Are they real?"',
    '"Have you ever met Luke Skywalker?"',
    '"Thank you. Have a nice day!"',
    "Go again? Press 'Reset' to flashy-thing my memory!",
];

let testMessageState = 0;

// Function test message event listener
const clickTestMessageButton = () => {
    if (testMessageState < 7) {
        testMessageState += 1;
    }
    let inputField = document.getElementById("user-input");
    inputField.value = testMessagesTexts[testMessageState - 1];
    testMessages(testMessageState);
    sendMessage();
};

// Function set memory reset button
const setResetButton = () => {
    let resetButton = document.getElementById("btnReset");
    resetButton.addEventListener("click", () => {
        buttons = document.querySelectorAll(".tmBtn");
        buttons.forEach((element) => {
            element.removeEventListener("click", clickTestMessageButton);
            element.disabled = true;
        });
        testMessageState = 0;
        testMessages(testMessageState);
        let messageList = document.getElementById("chat-content");
        messageList.innerHTML = `<div class="message-bot">Hi, I’m Professor Starstuff! 
        ✨<br> Ask me anything about space, and let’s explore the universe together! 🚀</div>`;
        // Send the POST request
        fetch("/reset/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
            },
        }).then(() => {
            console.log("Reset triggered");
        });
    });
};

// Function handle test messages
const testMessages = (testMessageState) => {
    // Display test message
    message = testMessagesTexts[testMessageState];
    let testMessageDisplay = document.getElementById("test-message");
    testMessageDisplay.innerText = message;
    // Deactivate old test message button
    if (testMessageState > 0) {
        oldButton =
            document.getElementsByClassName("tmBtn")[testMessageState - 1];
        oldButton.disabled = true;
    }
    // Activate new test message button
    if (testMessageState < 7) {
        let activeButton =
            document.getElementsByClassName("tmBtn")[testMessageState];
        activeButton.disabled = false;
        activeButton.addEventListener("click", clickTestMessageButton);
    }
};

// Function insert retrieved image
const insertImages = (images) => {
    imageContainers = document.getElementsByClassName("nasa-image");
    Array.from(imageContainers).forEach((el, i) => {
        el.innerHTML = `<img src="${images[i]}">`;
    });
};
