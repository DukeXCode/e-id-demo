-- Create tables
CREATE TABLE IF NOT EXISTS digital_identity (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                publicKey TEXT UNIQUE NOT NULL,
                                                firstName TEXT NOT NULL,
                                                lastName TEXT NOT NULL,
                                                dateOfBirth TEXT NOT NULL,
                                                address TEXT NOT NULL,
                                                placeOfOrigin TEXT NOT NULL,
                                                expiryDate TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_requests (
                                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     createdAt TEXT NOT NULL,
                                                     callbackUrl TEXT NOT NULL,
                                                     publicKey TEXT NOT NULL
);

-- Sample data
INSERT INTO digital_identity (publicKey, firstName, lastName, dateOfBirth, address, placeOfOrigin, expiryDate)
VALUES
    ('pk_alice_123', 'Alice', 'Smith', '1990-05-15', '123 Main St, Zurich', 'Bern', '2028-05-15'),
    ('pk_bob_456', 'Bob', 'Mueller', '1985-11-22', '456 Oak Ave, Geneva', 'Basel', '2027-11-22'),
    ('pk_charlie_789', 'Charlie', 'Weber', '1992-03-08', '789 Pine Rd, Lausanne', 'Zurich', '2029-03-08');