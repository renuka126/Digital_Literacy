function switchLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(el => el.style.display = 'none');
    document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => el.style.display = 'block');
    document.querySelectorAll('#language-switcher button').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(`btn-${lang}`);
    if (btn) btn.classList.add('active');
    localStorage.setItem('preferredLanguage', lang);
}

window.addEventListener('load', function() {
    const saved = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(saved);
});

function showUsage(appName) {
    let guide = document.getElementById("usage-guide-" + appName);
    if (!guide) {
        guide = document.createElement('div');
        guide.id = "usage-guide-" + appName;
        guide.className = 'usage-guide-container';
        guide.style.display = 'none';
        guide.innerHTML = typeof generateYouTubeGuide === 'function' ? generateYouTubeGuide() : "<p>Guide not available.</p>";
        document.body.appendChild(guide);
    }
    guide.style.display = (guide.style.display === "none" || guide.style.display === "") ? "block" : "none";
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const remember = document.getElementById("rememberMe").checked;
        if (!username || !password) {
            alert("Please enter both username and password!");
            return;
        }
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await res.json();
            if (result.success) {
                if (remember) localStorage.setItem('dlh_remember', username);
                else localStorage.removeItem('dlh_remember');
                document.getElementById("loginPage").style.display = "none";
                document.getElementById("mainContent").style.display = "block";
            } else {
                alert(result.message || "Login failed!");
            }
        } catch (err) {
            alert("Network error during login.");
            console.error(err);
        }
    });
}

async function saveUserProgress(sectionId, progressData) {
    try {
        const res = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sectionId, progressData })
        });
        const data = await res.json();
        console.log("Progress saved:", data);
    } catch (err) {
        console.error("Error saving progress:", err);
    }
}

