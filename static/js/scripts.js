// Shuffle images
let imageShuffle;
let shufflePosition;
let introState = false;

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
        newMessage.textContent = input.slice(1, -1);
        document.getElementById("chat-content").appendChild(newMessage);
        document.getElementById("user-input").value = "";
        document.getElementById("user-input").focus();
        input = input.trim().replace(/^"|"$/g, "");
        input = `"${input}"`;
        console.log(input); // Output: `"Hello, world!"`
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
                // Set shuffle vars
                imageShuffle = result.response[1];
                shufflePosition = [
                    ...Array(imageShuffle.length - 1).keys(),
                ].map((n) => n + 1);
            }
            if (result.response[2]) {
                topic = result.response[2]["topic"];
                // Set topic
                setTopic(topic);
                // Set image shuffle
                setShuffle(topic);
                // Activate podcast teaser button
                console.log(result.response[2]["teaser"]);
                activatePodcastTeaserBtn();
            } else {
                console.log("no topic set");
            }
        });
};

// Image container set shuffle
const setShuffle = (topic) => {
    let shuffleButton = document.getElementById("shuffle-button");
    if (topic && shuffleButton.innerText != topic) {
        shuffleButton.style.display = "block";
        shuffleButton.addEventListener("click", shuffleImages);
    }
};

// Topic container insert topic
const setTopic = (topic) => {
    console.log(topic);
    let topicHeader = document.getElementById("topic-header");
    topicHeader.innerText = "🌌 Our Topic";
    let topicSet = document.getElementById("topic-text");
    topicSet.innerText = topic.toUpperCase();
    topicSet.classList.replace("topic-not", "topic-set");
};

// Test messages
const testMessagesTexts = [
    '"Hello. I do have a question about the universe."',
    '"How hot is it on the sun?"',
    '"And on Jupiter?"',
    '"How about brown dwarfs? Are they real?"',
    '"Would I be able to live on them?"',
    '"Have you ever met Luke Skywalker?"',
    '"Do you know his father?"',
    `"Go again? Press 'Reset' to flashy-thing my memory! "`,
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
        let buttons = document.querySelectorAll(".tmBtn");
        buttons.forEach((element) => {
            element.removeEventListener("click", clickTestMessageButton);
            element.disabled = true;
        });
        testMessageState = 0;
        testMessages(testMessageState);
        // Reset messages
        let messageList = document.getElementById("chat-content");
        messageList.innerHTML = `<div class="message-bot">Hi, I’m Professor Starstuff! 
        ✨<br> Ask me anything about space, and let’s explore the universe together! 🚀</div>`;
        // Reset topic container
        let topicHeader = document.getElementById("topic-header");
        topicHeader.innerText = "🌌 Current Topic";
        let topicSet = document.getElementById("topic-text");
        topicSet.innerHTML = "... waiting";
        topicSet.classList.replace("topic-set", "topic-not");
        // Reset NASA images container
        let imageBox = document.getElementsByClassName("nasa-image");
        let shuffleButton = document.getElementById("shuffle-button");
        shuffleButton.style.display = "none";
        Array.from(
            imageBox
        )[0].innerHTML = `<img src="/static/images/shutter.png" alt="Camera shutter" />`;
        // Reset Podcast container
        let podcastTeaser = document.getElementById("podcast-teaser-btn");
        let podcastEpisode = document.getElementById("podcast-full-btn");
        podcastTeaser.classList.replace("podcast-teaser-animate", "disabled");
        podcastEpisode.classList.replace("podcast-full-animate", "disabled");
        //Send the POST request
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
    let testMessageDisplay = document.getElementById("test-message-text");
    testMessageDisplay.innerText = message;
    let messageBox = document.getElementById("test-message");
    if (testMessageState == 7) {
        // Toggle color messages/reset (to purple)
        messageBox.style.borderColor = "rgb(122, 0, 122)";
        messageBox.style.backgroundColor = "rgba(82, 0, 82, 0.7)";
        messageBox.style.borderBottomRightRadius = "10px";
        messageBox.style.borderTopLeftRadius = "0px";
        document.getElementById("test-message-emoji").innerText = "🧙‍♂️ ";
    } else if (testMessageState == 0) {
        // Toggle color messages/reset (to green)
        messageBox.style.borderColor = "rgb(0, 145, 0)";
        messageBox.style.backgroundColor = "rgba(0, 95, 0, 0.85)";
        messageBox.style.borderBottomRightRadius = "0px";
        messageBox.style.borderTopLeftRadius = "10px";
        document.getElementById("test-message-emoji").innerText = "👨🏾‍🚀 ";
    }
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

// Function shuffle topic images
const shuffleImages = () => {
    // Pick a random index
    let randomPick = Math.floor(Math.random() * shufflePosition.length);
    imageContainers = document.getElementsByClassName("nasa-image");
    randomPick = shufflePosition.splice(randomPick, 1)[0];
    Array.from(
        imageContainers
    )[0].innerHTML = `<img src="${imageShuffle[randomPick]}">`;
    // Refill shuffle array
    if (shufflePosition.length == 0) {
        shufflePosition = [...Array(imageShuffle.length - 1).keys()].map(
            (n) => n + 1
        );
    }
};

// Activate Podcast Buttons
const activatePodcastTeaserBtn = () => {
    let teaserBtn = document.getElementById("podcast-teaser-btn");
    let episodeBtn = document.getElementById("podcast-full-btn");
    teaserBtn.classList.replace("disabled", "podcast-teaser-animate");
    episodeBtn.classList.replace("disabled", "podcast-full-animate");
    console.log("podcast buttons activated");
};

// Podcast Request & Audio Playback
const podcast = async (button) => {
    console.log(button.innerText.slice(4));
    let podcastType = button.innerText.slice(4);
    //Send the POST request
    let response = await fetch("/podcast/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ type: podcastType }),
    });
    // Convert response to a blob (mp3 file)
    let audioBlob = await response.blob();
    // Create temporary URL for mp3 file
    let audioUrl = URL.createObjectURL(audioBlob);
    // Create audio element and play
    let audio = new Audio(audioUrl);
    audio.play();
    console.log("Podcast is playing...");
};

// Project Introduction Toggle
const introSwitch = () => {
    let introContainer = document.getElementById("introduction-container");
    let sectionBoxes = document.getElementsByClassName("section-box");
    if (!introState) {
        // switch ON
        introContainer.style.display = "block";
        Array.from(sectionBoxes).forEach((el) => {
            el.style.display = "none";
        });
        introState = true;
    } else {
        // switch OFF
        introContainer.style.display = "none";
        Array.from(sectionBoxes).forEach((el) => {
            el.style.display = "block";
        });
        introState = false;
    }
};
