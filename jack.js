function switchLanguage(lang) {
    
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(el => el.style.display = 'none');
    
    const selectedElements = document.querySelectorAll(`[data-lang="${lang}"]`);
    selectedElements.forEach(el => el.style.display = 'block');

    document.getElementById('btn-en').classList.remove('active');
    document.getElementById('btn-hi').classList.remove('active');
    document.getElementById('btn-mr').classList.remove('active');
    document.getElementById(`btn-${lang}`).classList.add('active');
    

    localStorage.setItem('preferredLanguage', lang);
}


window.onload = function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(savedLang);
};


window.onload = function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(savedLang);
};

function showUsage(appName) {
    let guide = document.getElementById("usage-guide-" + appName);
    if (!guide) {
        console.warn(`No usage guide found for: ${appName}. Creating one now...`);
        
        guide = document.createElement('div');
        guide.id = "usage-guide-" + appName;
        guide.className = 'usage-guide-container';
        guide.style.display = 'none';
        guide.innerHTML = generateYouTubeGuide(); 
        document.body.appendChild(guide); 
    }
    // 
    if (guide.style.display === "none" || guide.style.display === "") {
        guide.style.display = "block";
    } else {
        guide.style.display = "none";
    }
}
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;


    if (username && password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (result.success) {
                if (rememberMe) {
                    localStorage.setItem('dlh_remember', username);
                } else {
                    localStorage.removeItem('dlh_remember');
                }
                document.getElementById("loginPage").style.display = "none";
                document.getElementById("mainContent").style.display = "block";
            } else {
                alert(result.message || "Login failed!");
            }
        } catch (err) {
            alert("Network error during login.");
        }
    } else {
        alert("Please enter both username and password!");
    }
});


function saveUserProgress(sectionId, progressData) {
    fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, progressData })
    })
    .then(res => res.json())
    .then(data => {
       
    })
    .catch(err => {
       
    });
}

