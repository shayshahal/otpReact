const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');
const Twilio = require('twilio');

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const port = process.env.PORT || 5000;
const client = new Twilio(accountSid, authToken);
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '/client/dist')));
app.use(express.static(path.join(__dirname, '/client/dist/assets')));

app.use((req, res, next) => {
	req.body.phoneNumber = '+972' + req.body.phoneNumber;
	next();
});

app.post(
	'/send-verification-code',
	asyncHandler(async (req, res) => {
		const phoneNumber = req.body.phoneNumber;
		await client.verify.v2
			.services(serviceSid)
			.verifications.create({ to: phoneNumber, channel: 'sms' });
		console.log('Success!');
		res.status(200).send('success');
	})
);

app.post(
	'/verify-code',
	asyncHandler(async (req, res) => {
		const { phoneNumber, verificationCode } = req.body;

		const verificationCheck = await client.verify.v2
			.services(serviceSid)
			.verificationChecks.create({
				to: phoneNumber,
				code: verificationCode,
			});

		if (verificationCheck.status === 'approved') {
			res.sendStatus(200);
			console.log('Success!');
		}
	})
);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/dist/index.html');
});

app.listen(port, () => {
	console.log('Listening on port ' + port);
});
