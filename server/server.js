import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import { query } from './db.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { getToken } from './authMiddleware.js';




const app = express();

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
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

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' })

        const isProduction = process.env.NODE_ENV === "production";

        const options = {
            httpOnly: true,
            secure: isProduction,
            maxAge: 86400000,
            sameSite: isProduction ? 'none' : 'lax',
            path: "/"
        }

        // 4. Success!
        res.cookie("token", token, options);
        res.status(200).json({
            message: "Authentication successful",
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).send("server error")
    }
})

app.get('/me', getToken, async (req, res) => {

    const user_id = req.user.id;

    try {

        const sql = `SELECT id, username, email FROM users WHERE id = $1 `

        const values = [user_id]

        const result = await query(sql, values)

        res.set('Cache-Control', 'no-store');

        res.status(200).json(result?.rows[0])
        
    } catch (error) {
        res.status(500).json("Invalid Credentials")
    }
})

app.get('/vault', getToken, async (req, res) => {



    const user_id = req.user.id;

    try {

        const sql = `  
    SELECT vaults.*, users.username
    FROM vaults
    JOIN users ON vaults.user_id = users.id
    WHERE vaults.user_id = $1`
        const value = [user_id]
        const result = await query(sql, value)

        res.set('Cache-Control', 'no-store');

        res.status(200).json(result?.rows);

    } catch (error) {
        res.status(500).json("ERROR")
    }
})


app.post('/vault', getToken, async (req, res) => {
    const { site_name, encrypted_password } = req.body;

    const user_id = req.user.id;

    console.log("reached vault")

    if (!site_name || !encrypted_password) {
        return res.status(400).json({ error: "Missing details" })
    }

    try {

        const sql = `INSERT INTO vaults (site_name, encrypted_password, user_id) VALUES ($1, $2, $3) RETURNING id`
        const values = [site_name, encrypted_password, user_id]
        const result = await query(sql, values)

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.log(error.message)
        res.status(500).send("server error")
    }
})


app.post('/logout', (req, res) => {

   const isProduction = process.env.NODE_ENV === "production";

        const options = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: "/"
        }

    res.clearCookie("token", options);
    res.status(200).json({ message: "Logged out successfully" });
})

app.put('/vault/:id', getToken, async (req, res) => {

    const user_id = req.user.id;

    const id = req.params.id;
    const { site_name, encrypted_password } = req.body;

    try {

        const sql = `UPDATE vaults SET site_name = ($1), encrypted_password = ($2) WHERE id = ($3) AND user_id = ($4) RETURNING *`
        const values = [site_name, encrypted_password, id, user_id];

        const result = await query(sql, values);


        if (result.rowCount === 1) {
            return res.status(200).json(result.rows[0])
        }

        return res.status(404).json('entry does not exist')

    } catch (error) {
        console.log(error.message)
        res.status(500).send("server error")
    }
})

app.delete('/vault/:id', getToken, async (req, res) => {

    const user_id = req.user.id;
    const id = req.params.id;

    try {

        const sql = `DELETE FROM vaults WHERE id = ($1) AND user_id = ($2)`;

        const values = [id, user_id];

        const result = await query(sql, values);


        if (result.rowCount === 1) {
            return res.status(200).json('Delete Successfull')
        }

        return res.status(404).json('entry does not exist')


    } catch (error) {
        console.log(error.message)
        res.status(500).send("server error")
    }
})

const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is officially UP on port ${PORT}`);
});
