import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import { query } from './db.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';




const app = express();

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
)); //to talk to the frontend 
app.use(express.json()); //convert the data to json for readability
app.use(cookieParser()); //for user session and it is secured 


app.get('/test', (req, res) => res.send("Server is alive!"));

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds); //double encryption on the frontend and backend

        const sql = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id'
        const values = [username, email, hashedPassword];
        const result = await query(sql, values);

        res.status(201).json(result.rows[0]);


    } catch (error) {
        console.log(error.message)
        res.status(500).send("server error")
    }
})

app.post('/login', async (req, res) => {

    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {

        const sql = 'SELECT * FROM users WHERE email = $1'; //this is the same as ${email} but secure
        const result = await query(sql, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0]; //the structure of pg stores results in the rows object so hence this line

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        const token =  jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '24h'})
        const options = {
            httpOnly: true,
            secure: false,
            maxAge: 86400000,
            sameSite: 'lax',
        }

        // 4. Success!
        res.cookie("token", token, options);
        res.status(200).json({
            message: "Authentication successful",
            user: { id: user.id, username: user.username, email: user.email}
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).send("server error")
    }
})

const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is officially UP on port ${PORT}`);
});
