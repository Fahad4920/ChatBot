
const ChatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const Chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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"; 
const inputInitHeight = ChatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatContent = className === "outgoing"
        ? '<span class="material-symbol-outlined"></span><p></p>'
        : '<span class="material-symbol-outlined"></span><p></p>';
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};
const generateResponse = (incomingChatLi) => 
{
    const API_URL = "https://api.openai.com/v1/chat/completions"; // Corrected API endpoint
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{ role: "user", content: userMessage }]
        })
    };
    fetch(API_URL, requestOptions)
        .then(response => response.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch(error => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => Chatbox.scrollTo(0, Chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = ChatInput.value.trim();
    if (!userMessage) return;
    ChatInput.value = "";
    ChatInput.style.height = `${inputInitHeight}px`;

    Chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    Chatbox.scrollTo(0, Chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking......", "incoming");
        Chatbox.appendChild(incomingChatLi);
        Chatbox.scrollTo(0, Chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

ChatInput.addEventListener("input", () => {
    ChatInput.style.height = `${inputInitHeight}px`;
    ChatInput.style.height = `${ChatInput.scrollHeight}px`;
});

ChatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);

chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));


