let currentSessionId = null;
let pollingInterval = null;

async function startVerification() {
    try {
        // Create verification session
        const response = await fetch('/api/verify/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        currentSessionId = data.sessionId;

        // Show QR code section
        document.getElementById('initial-state').classList.add('hidden');
        document.getElementById('verification-active')
            .classList.remove('hidden');

        // Generate QR code
        document.getElementById('qrcode').innerHTML = '';
        new QRCode(document.getElementById('qrcode'), {
            text: data.callbackUrl,
            width: 200,
            height: 200
        });

        // Start polling for verification status
        startPolling();
    } catch (error) {
        console.error('Error starting verification:', error);
        alert('Failed to start verification. Please try again.');
    }
}

function startPolling() {
    pollingInterval = setInterval(async () => {
        try {
            const response = await fetch(
                `/api/verify/status/${currentSessionId}`
            );
            const data = await response.json();

            if (data.status === 'completed' && data.verified) {
                stopPolling();
                showVerificationComplete();
            }
        } catch (error) {
            console.error('Polling error:', error);
        }
    }, 2000); // Poll every 2 seconds
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

function showVerificationComplete() {
    document.getElementById('verification-active').classList.add('hidden');
    document.getElementById('verification-complete')
        .classList.remove('hidden');
}

async function simulateVerification() {
    // This simulates the e-ID app calling the callback endpoint
    try {
        await fetch(`/api/simulate-callback/${currentSessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Simulation error:', error);
    }
}

function completePurchase() {
    alert('Purchase completed! 🎉\n\nIn a real app, this would process payment.');
    location.reload();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopPolling();
});
