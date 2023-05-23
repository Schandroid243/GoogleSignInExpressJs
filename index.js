const express = require('express');
const app = express();
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '908020662248-4avibqhg0tk2eledufh7jokj8thhtjgn.apps.googleusercontent.com'; // Replace with your Google OAuth2 client ID

app.use(express.json());

app.post('/api/google-auth', (req, res) => {
  const { token } = req.body;
  console.log('The token is: ' + token);
  async function verify() {
    const client = new OAuth2Client(CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userId = payload['sub'];
      const userEmail = payload['email'];
      // Retrieve additional user information from the payload as needed

      // Example: Sending the user information back as a response
      res.status(200).json({
        userId,
        userEmail,
        // Include additional user information here
      });
    } catch (error) {
      console.error('Error verifying Google token:', error);
      res.status(401).send('Unauthorized');
    }
  }

  verify().catch(() => {
    res.status(401).send('Unauthorized');
  });
});

const PORT = process.env.PORT || '3000';
const IP = process.env.IP || '192.168.18.13';

app.listen(PORT, IP, () => {
  console.log('Server is running on  192.168.18.13:3000');
});