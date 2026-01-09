document.addEventListener('DOMContentLoaded', function () {
    // Fill email from session storage
    const userEmail = sessionStorage.getItem('userEmail') || 'usuario@ejemplo.com';
    const emailInput = document.getElementById('checkoutEmail');
    if (emailInput) {
        emailInput.value = userEmail;
    }

    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }

    // Expiry date formatting
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Payment Form Submission
    const paymentForm = document.getElementById('paymentForm');
    const payButton = document.querySelector('.pay-button');
    const btnText = document.querySelector('.btn-text');
    const spinner = document.querySelector('.spinner');
    const successOverlay = document.getElementById('successOverlay');
    const countdownSpan = document.getElementById('countdown');

    if (paymentForm) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simulate processing
            payButton.disabled = true;
            btnText.style.opacity = '0';
            spinner.classList.remove('hidden');

            setTimeout(() => {
                // Success state
                successOverlay.classList.remove('hidden');

                // Countdown redirect
                let seconds = 5;
                const interval = setInterval(() => {
                    seconds--;
                    countdownSpan.textContent = seconds;
                    if (seconds <= 0) {
                        clearInterval(interval);
                        // In a real app, this would go to the members area
                        window.location.href = 'index.html';
                    }
                }, 1000);

            }, 2000);
        });
    }
});
