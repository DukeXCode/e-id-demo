const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for verification sessions
const verificationSessions = new Map();

// Generate a new verification session
app.post('/api/verify/create', (req, res) => {
    const sessionId = crypto.randomBytes(16).toString('hex');

    verificationSessions.set(sessionId, {
        status: 'pending',
        createdAt: Date.now(),
        verified: false
    });

    // Clean up old sessions after 5 minutes
    setTimeout(() => {
        verificationSessions.delete(sessionId);
    }, 5 * 60 * 1000);

    // The QR code will encode this URL that the e-ID app should call
    const callbackUrl = `${req.protocol}://${req.get('host')}/api/verify/callback/${sessionId}`;

    res.json({ sessionId, callbackUrl });
});

// Check verification status (polling endpoint)
app.get('/api/verify/status/:sessionId', (req, res) => {
    const session = verificationSessions.get(req.params.sessionId);

    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
        status: session.status,
        verified: session.verified,
        ageVerified: session.ageVerified,
        timestamp: session.verifiedAt
    });
});

// Callback endpoint (called by e-ID app)
app.post('/api/verify/callback/:sessionId', (req, res) => {
    const session = verificationSessions.get(req.params.sessionId);

    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    // In real implementation, verify the signature/token from e-ID app
    const { ageVerified, age } = req.body;

    session.status = 'completed';
    session.verified = true;
    session.ageVerified = ageVerified;
    session.age = age;
    session.verifiedAt = Date.now();

    res.json({ success: true });
});

// Simulate e-ID app callback (for testing without actual app)
app.post('/api/simulate-callback/:sessionId', (req, res) => {
    const session = verificationSessions.get(req.params.sessionId);

    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    session.status = 'completed';
    session.verified = true;
    session.ageVerified = true;
    session.verifiedAt = Date.now();

    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
