document.addEventListener('DOMContentLoaded', function () {
    const accessForm = document.getElementById('accessForm');
    const formContainer = document.getElementById('formContainer');
    const classSection = document.getElementById('classSection');
    const userNameSpan = document.getElementById('userName');
    const videoModal = document.getElementById('videoModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const terminalBody = document.getElementById('terminalBody');
    const terminalPreview = document.getElementById('terminalPreview');

    // Terminal commands for animation
    const terminalCommands = [
        { text: '$ nmap -sV -sC 192.168.1.100', type: 'command' },
        { text: 'Starting Nmap 7.94 ( https://nmap.org )', type: 'output' },
        { text: 'Nmap scan report for target.local (192.168.1.100)', type: 'output' },
        { text: 'Host is up (0.0023s latency).', type: 'success' },
        { text: '', type: 'output' },
        { text: 'PORT     STATE  SERVICE     VERSION', type: 'info' },
        { text: '22/tcp   open   ssh         OpenSSH 8.9', type: 'success' },
        { text: '80/tcp   open   http        Apache 2.4.52', type: 'success' },
        { text: '443/tcp  open   https       nginx 1.18.0', type: 'success' },
        { text: '3306/tcp open   mysql       MySQL 8.0.28', type: 'warning' },
        { text: '8080/tcp open   http-proxy  Squid 4.13', type: 'warning' },
        { text: '', type: 'output' },
        { text: '$ nikto -h http://192.168.1.100', type: 'command' },
        { text: '- Nikto v2.5.0', type: 'output' },
        { text: '+ Target IP:          192.168.1.100', type: 'output' },
        { text: '+ Target Hostname:    target.local', type: 'output' },
        { text: '+ Target Port:        80', type: 'output' },
        { text: '+ Server: Apache/2.4.52 (Ubuntu)', type: 'info' },
        { text: '+ /admin/: Directory indexing found.', type: 'warning' },
        { text: '+ /backup/: Backup files found.', type: 'warning' },
        { text: '', type: 'output' },
        { text: '$ msfconsole', type: 'command' },
        { text: '       =[ metasploit v6.3.4-dev ]', type: 'info' },
        { text: '+ -- --=[ 2294 exploits - 1201 auxiliary ]', type: 'output' },
        { text: '+ -- --=[ 951 payloads - 45 encoders ]', type: 'output' },
        { text: '', type: 'output' },
        { text: 'msf6 > search apache', type: 'command' },
        { text: 'Matching Modules', type: 'info' },
        { text: '================', type: 'output' },
        { text: '  exploit/multi/http/apache_mod_cgi', type: 'success' },
        { text: '  exploit/linux/http/apache_path_traversal', type: 'success' },
    ];

    // Preview terminal lines (shorter version)
    const previewLines = [
        { text: '$ nmap -sV 192.168.1.100', type: 'cmd' },
        { text: 'Starting Nmap 7.94...', type: 'out' },
        { text: 'PORT   STATE SERVICE', type: 'out' },
        { text: '22/tcp open  ssh', type: 'grn' },
        { text: '80/tcp open  http', type: 'grn' },
        { text: '$ nikto -h target.local', type: 'cmd' },
        { text: '+ Server: Apache/2.4.52', type: 'out' },
        { text: '+ /admin/: Found', type: 'grn' },
    ];

    let previewInterval = null;
    let modalInterval = null;

    // Start preview animation
    function startPreviewAnimation() {
        if (!terminalPreview) return;

        let lineIndex = 0;

        function addPreviewLine() {
            if (lineIndex >= previewLines.length) {
                terminalPreview.innerHTML = '';
                lineIndex = 0;
            }

            const line = previewLines[lineIndex];
            const lineEl = document.createElement('div');
            lineEl.className = `terminal-preview-line ${line.type}`;
            lineEl.textContent = line.text;
            lineEl.style.animationDelay = '0s';
            terminalPreview.appendChild(lineEl);

            // Keep only last 8 lines
            while (terminalPreview.children.length > 8) {
                terminalPreview.removeChild(terminalPreview.firstChild);
            }

            lineIndex++;
        }

        addPreviewLine();
        previewInterval = setInterval(addPreviewLine, 800);
    }

    // Modal terminal animation
    function startModalAnimation() {
        if (!terminalBody) return;

        terminalBody.innerHTML = '';
        let lineIndex = 0;

        function addLine() {
            if (lineIndex >= terminalCommands.length) {
                // Reset after completion
                setTimeout(() => {
                    terminalBody.innerHTML = '';
                    lineIndex = 0;
                    addLine();
                }, 2000);
                return;
            }

            const cmd = terminalCommands[lineIndex];
            const lineEl = document.createElement('div');
            lineEl.className = `terminal-line-item ${cmd.type}`;
            lineEl.textContent = cmd.text;
            lineEl.style.animationDelay = '0s';
            terminalBody.appendChild(lineEl);

            // Auto scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;

            lineIndex++;

            // Vary timing based on line type
            const delay = cmd.type === 'command' ? 600 : 150;
            modalInterval = setTimeout(addLine, delay);
        }

        addLine();
    }

    function stopModalAnimation() {
        if (modalInterval) {
            clearTimeout(modalInterval);
            modalInterval = null;
        }
    }

    // Get modal video element
    const modalVideo = document.getElementById('modalVideo');

    // Open modal
    function openModal() {
        if (videoModal) {
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Play video when modal opens
            if (modalVideo) {
                modalVideo.play();
            }
        }
    }

    // Close modal
    function closeModal() {
        if (videoModal) {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
            // Pause video when modal closes
            if (modalVideo) {
                modalVideo.pause();
            }
        }
    }

    // Modal event listeners
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Video trigger (play button)
    const videoTrigger = document.getElementById('videoTrigger');
    if (videoTrigger) {
        videoTrigger.addEventListener('click', openModal);
    }

    // Legacy play button support
    const playButton = document.querySelector('.play-button');
    if (playButton && !videoTrigger) {
        playButton.addEventListener('click', openModal);
    }

    // Form submission
    if (accessForm) {
        accessForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();

            if (!nombre || !email) {
                return;
            }

            if (!isValidEmail(email)) {
                return;
            }

            unlockClass(nombre);
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function unlockClass(nombre) {
        formContainer.innerHTML = `
            <div class="form-header" style="margin-bottom: 0;">
                <div class="form-lock" style="background: var(--accent-glow); border-color: var(--border-accent);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 5-5 5 5 0 0 1 5 5"/>
                    </svg>
                </div>
                <h3 style="color: var(--accent-primary);">¡Acceso Concedido!</h3>
                <p>Desplázate hacia abajo para ver tu clase.</p>
            </div>
        `;

        const firstName = nombre.split(' ')[0];
        userNameSpan.textContent = firstName;

        classSection.classList.remove('hidden');

        // Start preview animation when class section is visible
        setTimeout(function () {
            startPreviewAnimation();
        }, 500);

        setTimeout(function () {
            classSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);

        sessionStorage.setItem('userRegistered', 'true');
        sessionStorage.setItem('userName', firstName);

        // Save email for payment page
        const emailInput = document.getElementById('email');
        if (emailInput) {
            sessionStorage.setItem('userEmail', emailInput.value.trim());
        }
    }

    function checkExistingAccess() {
        const isRegistered = sessionStorage.getItem('userRegistered');
        const savedName = sessionStorage.getItem('userName');

        if (isRegistered === 'true' && savedName) {
            userNameSpan.textContent = savedName;
            classSection.classList.remove('hidden');

            formContainer.innerHTML = `
                <div class="form-header" style="margin-bottom: 0;">
                    <div class="form-lock" style="background: var(--accent-glow); border-color: var(--border-accent);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 5-5 5 5 0 0 1 5 5"/>
                        </svg>
                    </div>
                    <h3 style="color: var(--accent-primary);">Acceso Activo</h3>
                    <p>Ya tienes acceso a la clase.</p>
                </div>
            `;

            // Start preview animation for returning users
            setTimeout(startPreviewAnimation, 500);
        }
    }

    checkExistingAccess();

    // Lesson items interaction
    const lessonItems = document.querySelectorAll('.lesson-item');
    lessonItems.forEach(function (item) {
        item.addEventListener('click', function () {
            lessonItems.forEach(function (li) {
                li.classList.remove('active');
            });
            item.classList.add('active');
        });
    });

    // Smooth scroll for nav CTA
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        navCta.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});
