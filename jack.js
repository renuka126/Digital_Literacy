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
    
    const remembered = localStorage.getItem('dlh_remember');
    if (remembered) {
        const user = document.getElementById('username');
        const checkbox = document.getElementById('rememberMe');
        if (user) user.value = remembered;
        if (checkbox) checkbox.checked = true;
    }
    
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
});

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
    
    if (tab === 'signIn') {
        const tab1 = document.getElementById('signInTab');
        const form1 = document.getElementById('loginForm');
        if (tab1) tab1.classList.add('active');
        if (form1) form1.classList.add('active');
    } else if (tab === 'signUp') {
        const tab2 = document.getElementById('signUpTab');
        const form2 = document.getElementById('signupForm');
        if (tab2) tab2.classList.add('active');
        if (form2) form2.classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const user = document.getElementById("username");
    const pass = document.getElementById("password");
    const rem = document.getElementById("rememberMe");
    
    if (!user || !pass) {
        alert("Form fields missing");
        return;
    }
    
    const username = user.value.trim();
    const password = pass.value.trim();
    const remember = rem ? rem.checked : false;
    
    if (!username || !password) {
        alert("Please enter username and password!");
        return;
    }
    
    if (remember) {
        localStorage.setItem('dlh_remember', username);
    } else {
        localStorage.removeItem('dlh_remember');
    }
    
    alert('Login successful! Welcome to Literacy Hub.');
    
    const loginPage = document.getElementById("loginPage");
    const mainContent = document.getElementById("mainContent");
    
    if (loginPage) loginPage.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    
    showSection('home');
}

function handleSignup(event) {
    event.preventDefault();
    
    const user = document.getElementById('signupUsername');
    const mail = document.getElementById('signupEmail');
    const pwd = document.getElementById('signupPassword');
    const confirm = document.getElementById('confirmPassword');
    
    if (!user || !mail || !pwd || !confirm) {
        alert("Form fields missing");
        return;
    }
    
    const username = user.value.trim();
    const email = mail.value.trim();
    const password = pwd.value;
    const confirmPass = confirm.value;
    
    if (!username || !email || !password || !confirmPass) {
        alert('Fill in all fields!');
        return;
    }
    
    if (password !== confirmPass) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be 6+ characters!');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Invalid email address!');
        return;
    }
    
    alert('Signup successful! Sign in with your credentials.');
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) signupForm.reset();
    
    switchTab('signIn');
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showUsage(appName) {
    let guide = document.getElementById("usage-guide-" + appName);
    if (!guide) {
        guide = document.createElement('div');
        guide.id = "usage-guide-" + appName;
        guide.className = 'usage-guide-container';
        guide.style.display = 'none';
        guide.innerHTML = "<p>Guide not available.</p>";
        document.body.appendChild(guide);
    }
    guide.style.display = (guide.style.display === "none" || guide.style.display === "") ? "block" : "none";
}

window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            card.classList.add('in-view');
        }
    });
});

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
        console.error("Error:", err);
    }
}

