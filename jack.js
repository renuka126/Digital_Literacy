function showUsage(appName) {
    let guide = document.getElementById("usage-guide-" + appName);
    if (!guide) {
        console.warn(`No usage guide found for: ${appName}. Creating one now...`);
        
        // Create the guide container if it doesn't exist
        guide = document.createElement('div');
        guide.id = "usage-guide-" + appName;
        guide.className = 'usage-guide-container';
        guide.style.display = 'none'; // Initially hidden
        guide.innerHTML = generateYouTubeGuide(); // Generate content for YouTube
        document.body.appendChild(guide); // Append to body (or you can target a specific container)
    }
    // Toggle visibility
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

    // Backend integration: Send login data to backend API
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

// Backend integration: Call this when user navigates sections to save progress
function saveUserProgress(sectionId, progressData) {
    fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, progressData })
    })
    .then(res => res.json())
    .then(data => {
        // Optionally handle response
        // console.log('Progress saved:', data);
    })
    .catch(err => {
        // Optionally handle error
        // console.error('Progress save error:', err);
    });
}

function generateYouTubeGuide() {
    // Step-by-step guide HTML for YouTube (beginner-friendly with simple instructions and images)
    // FIX: Change all img scr= to img src=
    return `
        <div id="youtube-guide">
            <div id="step-description"></div>
            <img id="step-image" src="" alt="" />
            <div id="progress"></div>
            <button id="prev-btn">Previous</button>
            <button id="next-btn">Next</button>
            <button onclick="closeGuide('YouTube')">Close</button>
        </div>
        <script>
            const steps = [
                { title: "Step 1", description: "Description for step 1", image: "https://via.placeholder.com/150" },
                { title: "Step 2", description: "Description for step 2", image: "https://via.placeholder.com/150" },
                { title: "Step 3", description: "Description for step 3", image: "https://via.placeholder.com/150" }
            ];
            let currentStep = 0;
            
            function updateStep() {
                document.getElementById('step-description').innerHTML = steps[currentStep].description;
                document.getElementById('step-image').src = steps[currentStep].image;
                document.getElementById('step-image').alt = steps[currentStep].title;
                document.getElementById('progress').textContent = (currentStep + 1) + ' of ' + steps.length;
                const prevBtn = document.getElementById('prev-btn');
                const nextBtn = document.getElementById('next-btn');
                
                prevBtn.disabled = currentStep === 0;
                prevBtn.style.opacity = currentStep === 0 ? '0.5' : '1';
                prevBtn.style.background = currentStep === 0 ? '#6c757d' : '#007bff';
                
                nextBtn.disabled = currentStep === steps.length - 1;
                nextBtn.style.opacity = currentStep === steps.length - 1 ? '0.5' : '1';
                nextBtn.style.background = currentStep === steps.length - 1 ? '#6c757d' : '#007bff';
            }
            function closeGuide(appName) {
                const guide = document.getElementById('usage-guide-' + appName);
                if (guide) {
                    guide.style.display = 'none';
                }
            }
            // Initialize first step
            updateStep();

            // Backend integration: Save progress when navigating steps
            document.getElementById('prev-btn').onclick = function() {
                if (currentStep > 0) {
                    currentStep--;
                    updateStep();
                    saveUserProgress('YouTube', { step: currentStep });
                }
            };
            document.getElementById('next-btn').onclick = function() {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateStep();
                    saveUserProgress('YouTube', { step: currentStep });
                }
            };
        </script>
    `;
}

