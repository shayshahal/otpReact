import React, { useState } from 'react';

function PhoneForm({ onSend }: { onSend: (phoneNumber: string) => void }) {
	const [errMsg, setErrMsg] = useState('');
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const payload = Object.fromEntries(form);
		console.log(JSON.stringify(payload));
		try {
			const response = await fetch(
				'http://localhost:3000/send-verification-code',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);
			if (response.status !== 200) throw new Error('Error');
			onSend(payload.phoneNumber as string);
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
