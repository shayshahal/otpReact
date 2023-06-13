import { useState } from 'react';

function PhoneForm({ onSend }) {
	const [errMsg, setErrMsg] = useState('');
	async function handleSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const payload = Object.fromEntries(form);
		try {
			const response = await fetch(
				'https://localhost:3000/send-verification-code',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);
			if (response.status !== 200) throw new Error('Error');
			onSend(payload.phoneNumber);
		} catch (error) {
			if (error instanceof Error) setErrMsg(error.message);
			else setErrMsg(String(error));
			console.error(error);
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor='phoneNumber'>
				<input
					type='tel'
					name='phoneNumber'
					required
					id='phoneNumber'
				/>
				<span>{errMsg}</span>
			</label>
			<button>Send Code</button>
		</form>
	);
}
export default PhoneForm;