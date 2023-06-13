import { useState } from 'react';
import './App.css';
import Fingerprint from './Fingerprint';
import Nav from './Nav';
import Sms from './Sms';
function App() {
	const [appState, setAppState] = useState('sms');
	return (
		<>
			<Nav setAppState={setAppState} />
			{appState === 'sms' ? <Sms /> : <Fingerprint />}
		</>
	);
}

export default App;
