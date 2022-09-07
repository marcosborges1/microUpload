const express = require("express"); // Servidor
const cors = require("cors"); // Permitir requisição
const multer = require("multer");
const path = require("path");
const app = express();
const sha1 = require("sha1");

app.use(cors());
app.use(express.static("public"));

const port = 4000;
const folderPathName = "uploads";

//Upload usando Multer
const storage = multer.diskStorage({
	destination: `./public/${folderPathName}/`,
	filename: function (req, file, cb) {
		console.log(
			sha1(
				`${Date.now()}+hashing messages with the SHA-1 algorithm+!@marcos!@borges${
					file.originalname
				}`
			)
		);
		cb(null, "arquivo-" + Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 },
}).single("arquivo");
//FIM - Upload usando Multer

app.post("/upload", upload, (request, response) => {
	const arquivo = request.file.filename;
	response.json({
		name: arquivo,
		url: `${request.protocol}://${request.get(
			"host"
		)}/${folderPathName}/${arquivo}`,
	});
});

app.get("/", (request, response) => {
	response.send("<h4>Servidor Funcionando...</h4>");
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
