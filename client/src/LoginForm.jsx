import { startAuthentication } from '@simplewebauthn/browser';
import { useState } from 'react';

function LoginForm({ onLogin }) {
	const [err, setErr] = useState('');
	async function handleSubmit(e) {
		e.preventDefault();
		const resp = await fetch(
			document.URL + 'generate-authentication-options'
		);

		let asseResp;
		try {
			asseResp = await startAuthentication(await resp.json(), true);
		} catch (error) {
			setErr(error);
			throw error;
		}

		// POST the response to the endpoint that calls
		const verificationResp = await fetch(
			document.URL + '/verify-authentication',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(asseResp),
			}
		);

		// Wait for the results of verification
		const verificationJSON = await verificationResp.json();

		// Show UI appropriate for the `verified` status
		if (verificationJSON && verificationJSON.verified) {
			onLogin();
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
			<span>{err}</span>
			<button>Login</button>
		</form>
	);
}
export default LoginForm;