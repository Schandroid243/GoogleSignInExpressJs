const express = require("express");
const app = express();
const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID =
  "908020662248-4avibqhg0tk2eledufh7jokj8thhtjgn.apps.googleusercontent.com"; // Replace with your Google OAuth2 client ID

const db = require("./models/");
const User = db.users;

app.use(express.json());

app.post("/api/addUser", async (req, res) => {
  let info = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const user = await User.create(info);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

app.post("/api/google-auth", (req, res) => {
  const { token } = req.body;
  console.log("The token is: " + token);
  async function verify() {
    const client = new OAuth2Client(CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userId = payload["sub"];
      const userEmail = payload["email"];
      // Retrieve additional user information from the payload as needed
      //Checking if the current user email has already been saved in the database
      const existingUser = await User.findOne({
        where: { email: userEmail },
      });
      if (existingUser) {
        return res.status(200).json({
          userId: existingUser.id,
          userEmail: existingUser.email,
          message: "User exist you can proceed",
          // Include additional user information here
        });
      } else {
        console.log("User does not exist");
        res.status(400).json({
          message: "User does not exist please sign up",
        });
      }
    } catch (error) {
      console.error("Error verifying Google token:", error);
      res.status(401).send("Unauthorized");
    }
  }

  verify().catch(() => {
    res.status(401).send("Unauthorized");
  });
});

const PORT = process.env.PORT || "3000";
const IP = process.env.IP || "192.168.18.23";

app.listen(PORT, IP, () => {
  console.log("Server is running on  192.168.18.23:3000");
});
