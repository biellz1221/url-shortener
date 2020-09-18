const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { nanoid } = require('nanoid');
const yup = require('yup');
const monk = require('monk');

const app = express();

require('dotenv').config();

const db = monk(process.env.MONGO_URI);
//const db = monk('mongodb+srv://admin:CavaloFesteiro2020,@cluster0.byqos.gcp.mongodb.net/urls?retryWrites=true&w=majority');

const urls = db.get('urls');
urls.createIndex({ slug: 1 }, { unique: true });

app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

const schema = yup.object().shape({
	slug: yup
		.string()
		.trim()
		.matches(/[\w\-]/i),
	url: yup.string().trim().url().required(),
});

app.get('/', (req, res) => {
	res.json({
		message: 'tes.te',
	});
});

app.get('/:id', async (req, res, next) => {
	const { id: slug } = req.params;
	try {
		const url = await urls.findOne({ slug });
		if (url) {
			let addClicks = url.clicks + 1;
			urls.findOneAndUpdate({ slug }, { $set: { clicks: addClicks } });
			res.redirect(url.url);
		} else {
			res.redirect(`/?error=${slug} not found`);
		}
	} catch (e) {
		res.redirect(`/?error=Link not found blerp`);
	}
});

app.post('/url', async (req, res, next) => {
	let { slug, url } = req.body;
	try {
		await schema.validate({
			slug,
			url,
		});
		if (!slug) {
			slug = nanoid(5);
		}
		// else {
		//     const existing = await urls.findOne({ slug });
		//     if(existing) {
		//         throw new Error('Slug in use.')
		//     }
		// }
		slug = slug.toLowerCase();
		const newURL = {
			url,
			slug,
			clicks: 0,
		};
		const created = await urls.insert(newURL);
		res.json(created);
	} catch (e) {
		if (e.message.startsWith('E11000')) {
			e.message = 'Slug is in use';
		}
		next(e);
	}
});

app.use((error, req, res, next) => {
	if (error.status) {
		res.status(error.status);
	} else {
		res.status(500);
	}
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? 'Nope' : error.stack,
	});
});

app.get('/url/:id', (req, res) => {
	//TODO: return info on the URL
});

const port = process.env.PORT || 1337;

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
