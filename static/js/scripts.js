// Global states
let imageShuffle;
let shufflePosition;
let introState = false;
let podCastText;
let podCastTopic;
let isPlaying = false;
let audio;

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
    for (let i = 0; i < 500; i++) {
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
        if (input.startsWith('"') && input.endsWith('"')) {
            newMessage.textContent = input.slice(1, -1);
        } else {
            newMessage.textContent = input;
        }
        document.getElementById("chat-content").appendChild(newMessage);
        document.getElementById("user-input").value = "";
        document.getElementById("user-input").focus();
        input = input.trim().replace(/^"|"$/g, "");
        input = `"${input}"`;
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
                podCastText = result.response[2]["teaser"];
                podCastTopic = result.response[2]["topic"];
                activatePodcastTeaserBtn();
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
        Array.from(imageBox)[0].innerHTML = `
        <video preload="auto" autoplay loop muted id="shutter-image">
            <source src="/static/animations/shutter.webm" type="video/webm">
        </video>`;
        // Reset Podcast container
        let podcastTeaser = document.getElementById("podcast-teaser-btn");
        let podcastEpisode = document.getElementById("podcast-full-btn");
        podcastTeaser.classList.replace("podcast-teaser-animate", "disabled");
        podcastEpisode.classList.replace("podcast-full-animate", "disabled");
        // Reset Audio playback
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset to the beginning
        }
        let playingStatus = document.getElementById("podcast-status");
        playingStatus.style.display = "none";
        //Send the POST request
        fetch("/reset/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
            },
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
    // Reset playing state when new topic is set
    isPlaying = false;
    teaserBtn.classList.replace("disabled", "podcast-teaser-animate");
    episodeBtn.classList.replace("disabled", "podcast-full-animate");
};

// Deactivate Podcast Buttons
const deactivatePodcastBtn = () => {
    let teaserBtn = document.getElementById("podcast-teaser-btn");
    let episodeBtn = document.getElementById("podcast-full-btn");
    teaserBtn.classList.replace("podcast-teaser-animate", "disabled");
    episodeBtn.classList.replace("podcast-full-animate", "disabled");
};

// Podcast Request & Audio Playback
const podcast = async (button) => {
    if (isPlaying) {
        return; // Prevent multiple clicks
    }
    // Set the playing flag to true
    isPlaying = true;
    let podcastType = button.innerText.slice(4);
    // Disable buttons
    deactivatePodcastBtn();
    // Create and add spinner
    let spinner = document.createElement("span");
    spinner.classList.add("spinner-border", "spinner-border-sm");
    spinner.setAttribute("role", "status");
    spinner.style.marginLeft = "10px";
    button.appendChild(spinner);
    // Send the POST request
    let response = await fetch("/podcast/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
            type: podcastType,
            podText: podCastText,
            podTopic: podCastTopic,
        }),
    });
    // Create audio element (mp3) and play
    let audioBlob = await response.blob();
    let audioUrl = URL.createObjectURL(audioBlob);
    audio = new Audio(audioUrl);
    audio.play();
    // Activate frontend-status 'Podcast playing'
    let playingStatus = document.getElementById("podcast-status");
    playingStatus.style.display = "block";
    audio.onended = () => {
        isPlaying = false;
        activatePodcastTeaserBtn();
        // Deactivate frontend-status 'Podcast playing'
        playingStatus.style.display = "none";
    };
    spinner.remove();
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

// Function random shooting stars
const createShootingStars = () => {
    const shootingSky = document.body;
    function createShootingStar() {
        const shootingStar = document.createElement("div");
        shootingStar.classList.add("shooting-star");
        let startX, startY, endX, endY, angle, duration;
        // Randomize start position from left/right/top
        let side = Math.floor(Math.random() * 3);
        switch (side) {
            case 0: // Left to Right
                startX = -50;
                startY = Math.random() * shootingSky.clientHeight;
                endX = shootingSky.clientWidth + 50;
                endY = startY - (Math.random() * 150 - 875);
                break;
            case 1: // Right to Left
                startX = shootingSky.clientWidth + 50;
                startY = Math.random() * shootingSky.clientHeight;
                endX = -50;
                endY = startY - (Math.random() * 150 - 875);
                break;
            case 2: // Top to Bottom (possible left or right)
                startX = Math.random() * shootingSky.clientWidth;
                startY = -50;
                endX = startX + (Math.random() * 1000 - 500);
                endY = shootingSky.clientHeight + 150;
                break;
        }
        // Calculate angle of movement
        angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
        duration = Math.random() * 0.5 + 0.5;
        // Apply styles
        shootingStar.style.left = `${startX}px`;
        shootingStar.style.top = `${startY}px`;
        shootingStar.style.transform = `rotate(${angle + 90}deg)`;
        shootingStar.style.animation = `shooting ${duration}s linear forwards`;
        // Append shooting star
        shootingSky.appendChild(shootingStar);
        // Move the star across the screen
        shootingStar.animate(
            [
                {
                    transform: `translate(0, 0) rotate(${angle + 90}deg)`,
                    opacity: 1,
                },
                {
                    transform: `translate(${endX - startX}px, ${
                        endY - startY
                    }px) rotate(${angle + 90}deg)`,
                    opacity: 0,
                },
            ],
            {
                duration: duration * 1000,
                easing: "linear",
                fill: "forwards",
            }
        );
        // Remove after animation
        setTimeout(() => {
            shootingStar.remove();
        }, duration * 1500);
        // Set new random interval for next shooting star
        let nextInterval = Math.random() * 3.5 + 0.5;
        setTimeout(createShootingStar, nextInterval * 1000);
    }
    createShootingStar();
};
