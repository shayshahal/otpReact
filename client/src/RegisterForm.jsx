import { startRegistration } from '@simplewebauthn/browser';
import { useState } from 'react';

function RegisterForm({ onRegister }) {
	const [err, setErr] = useState('');
	async function handleSubmit(e) {
		e.preventDefault();
		const resp = await fetch(document.URL + 'generate-registration-option');
		let attResp;
		try {
			// Pass the options to the authenticator and wait for a response
			attResp = await startRegistration(await resp.json());
		} catch (error) {
			// Some basic error handling
			if (error.name === 'InvalidStateError') {
				setErr(
					'Error: Authenticator was probably already registered by user'
				);
			} else {
				setErr(error);
			}

			throw error;
		}

		const verificationResp = await fetch(
			document.URL + 'verify-registration',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(attResp),
			}
		);

		const verificationJSON = await verificationResp.json();

		if (verificationJSON && verificationJSON.verified) {
			onRegister();
		} else {
			setErr(
				`Oh no, something went wrong! Response: ${JSON.stringify(
					verificationJSON
				)}`
			);
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor='username'>
				Username:
				<input
					type='text'
					id='username'
					name='username'
					autoComplete='webauthn'
					autoFocus
					required
				/>
			</label>

			<span>{err}</span>
			<button>Register</button>
		</form>
	);
}
export default RegisterForm;