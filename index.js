import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const API_URL = "http://localhost:3001"; // Backend API URL

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let sortBy = 'id';
let searchBy = '';
let books = [];

app.get("/", async (req, res) => {
    // Fetch notes from backend API
    try {
    sortBy = req.query.sortBy || sortBy;
    searchBy = req.query.search || searchBy;
    const result = await axios.get(API_URL + `/top/?limit=10&orderBy=${sortBy}&like=${searchBy}`);
    books = result.data.data;
    console.log(books);

    res.render("index.ejs", { sortBy:sortBy, books: books });
    } catch (error) {
    res.render("index.ejs", { sortBy:sortBy, books: books });
    }
});

app.get("/new", (req, res) => {
    res.render("new.ejs", { mode: "add", book: {} });
});

app.get("/edit/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (book) {
        res.render("new.ejs", { mode: "edit", book: book });
    } else {
        res.redirect("/");
    }
});

app.post("/new", async (req, res) => {
    const { title, note , rating, date } = req.body;
    try {
    await axios.post(API_URL + `/add/?title=${title}&rating=${rating}&date=${date}&note=${note}`);
    res.redirect("/");
    } catch (error) {
    res.render("new.ejs", { error: "Failed to add book. Please try again." });
    }
});

app.post("/edit/:id", async (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, note , rating, date } = req.body;
    try {
    await axios.patch(API_URL + `/update/${bookId}/?title=${title}&rating=${rating}&date=${date}&note=${note}`);
    res.redirect("/");
    } catch (error) {
    res.render("new.ejs", { mode: "edit", book: { id: bookId, title, note, rating, date }, error: "Failed to update book. Please try again." });
    console.log(error);
    }
});

app.get("/delete/:id", async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
    await axios.delete(API_URL + `/delete/${bookId}/`);
    res.redirect("/");
    } catch (error) {
    res.redirect("/");
    }
});

app.listen(PORT, () => {
  console.log(`Successfully started server on port ${PORT}.`);
});