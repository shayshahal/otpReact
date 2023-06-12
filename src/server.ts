import { config } from 'dotenv';
import express from 'express';
import { Twilio } from 'twilio';
config()
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const serviceSid = process.env.TWILIO_SERVICE_SID as string;

const client = new Twilio(accountSid, authToken);

const app = express()

app.use(express.json());

const PORT = process.env.PORT || 3000

app.post('/send-verification-code', (req, res) => {
    const { phoneNumber } = req.body;
    try {
        client.verify
        .v2.services(serviceSid)
        .verifications.create({ to: phoneNumber, channel: 'sms' })
        res.sendStatus(200);
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.sendStatus(500);
    }
});

app.post('/verify-code', async (req, res) =>{
    const { phoneNumber, verificationCode } = req.body;

    try{
        const verificationCheck = await client.verify.v2.services(serviceSid)
        .verificationChecks.create({ to: phoneNumber, code: verificationCode });

        if (verificationCheck.status === 'approved') {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    }
    catch(err){
        console.error('Error verifying code:', err);
        res.sendStatus(500)
    }
})

app.listen(PORT, ()=>{
    console.log('listening on port ' + PORT);
})