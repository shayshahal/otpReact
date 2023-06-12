import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import asyncHandler from 'express-async-handler';
import Twilio from 'twilio';
config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = new Twilio(accountSid, authToken);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
	console.log('listening on port ' + PORT);
});
