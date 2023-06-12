import React, { useState } from 'react';

function CodeForm({
	onVerify,
	phoneNumber,
}: {
	onVerify: (value: boolean) => void;
	phoneNumber: string;
}) {
	const [errMsg, setErrMsg] = useState('');
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const payload = Object.fromEntries(form);

		try {
			const response = await fetch('http://localhost:3000/verify-code', {
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
                    required
					autoComplete='one-time-code'
					id='verificationCode'
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
