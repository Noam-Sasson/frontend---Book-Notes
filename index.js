import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const API_URL = "http://localhost:3001"; // Backend API URL

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let sortBy = 'id'
let books = []

app.get("/", async (req, res) => {
    // Fetch notes from backend API
    try {
    const result = await axios.get(API_URL + "/top/?limit=10");
    books = result.data.data;
    res.render("index.ejs", { sortBy:sortBy, books: books });
    } catch (error) {
    res.render("index.ejs", { sortBy:sortBy, books: books });
    }
});

app.get("/new", (req, res) => {
    res.render("new.ejs");
});

app.listen(PORT, () => {
  console.log(`Successfully started server on port ${PORT}.`);
});