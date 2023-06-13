import { useEffect, useState } from 'react';

function CodeForm({ onVerify, phoneNumber }) {
	const [code, setCode] = useState('');
	useEffect(() => {
		console.log(window);
		console.log('OTPCredential' in window);
		if ('OTPCredential' in window) {
			setAc(new AbortController());
			setTimeout(() => {
				// abort after 2 minutes
				ac.abort();
			}, 2 * 60 * 1000);
			navigator.credentials
				.get({
					otp: { transport: ['sms'] },
					signal: ac.signal,
				})
				.then((otp) => {
					setCode(otp.code);
				})
				.catch((err) => {
					console.log(err);
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
					type='number'
					name='verificationCode'
					inputMode='numeric'
					required
					pattern='[0-9]*'
					autoComplete='one-time-code'
					id='verificationCode'
					value={code}
					is='one-time-code'
					onChange={(e) => setCode(e.currentTarget.value)}
				/>
				<span>{errMsg}</span>
			</label>
			<input
				type='hidden'
				name='phoneNumber'
				value={phoneNumber}
			/>
			<button>Verify</button>
		</form>
	);
}
export default CodeForm;
