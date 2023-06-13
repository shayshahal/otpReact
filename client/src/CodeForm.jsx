import { useEffect, useState } from 'react';

function CodeForm({ onVerify, phoneNumber }) {
	const [code, setCode] = useState('');
	useEffect(() => {
		if ('OTPCredential' in window) {
			const ac = new AbortController();
			setTimeout(() => {
				// abort after 10 minutes
				ac.abort();
			}, 10 * 60 * 1000);
			navigator.credentials
				.get({
					otp: { transport: ['sms'] },
					signal: ac.signal,
				})
				.then((otp) => {
					setCode(otp.code);
					ac.abort();
				})
				.catch((err) => {
					console.log(err);
					ac.abort();
				});
		}
	});
	const [errMsg, setErrMsg] = useState('');
	async function handleSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const payload = Object.fromEntries(form);

		try {
			const response = await fetch(document.URL + 'verify-code', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			if (response.status !== 200) throw new Error('Error');
			onVerify(true);
		} catch (error) {
			if (error instanceof Error) setErrMsg(error.message);
			else setErrMsg(String(error));
			console.error(error);
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor='verificationCode'>
				<input
					type='text'
					name='verificationCode'
					inputMode='numeric'
					required
					autoComplete='one-time-code'
					id='verificationCode'
					value={code}
					onChange={(e) => setCode(e.target.value)}
				/>
				<span>{errMsg}</span>
			</label>
			<input
				type='hidden'
				name='phoneNumber'
				value={phoneNumber}
			/>
			<span>{code}</span>
			<button>Verify</button>
		</form>
	);
}
export default CodeForm;
