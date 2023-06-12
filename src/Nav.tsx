function Nav({
	setAppState,
}: {
	setAppState: (v: 'sms' | 'fingerprint') => void;
}) {
	return (
		<nav>
			<ul>
				<li>
					<button
						onClick={() => {
							setAppState('sms');
						}}
					>
						SMS
					</button>
				</li>
				<li>
					<button
						onClick={() => {
							setAppState('fingerprint');
						}}
					>
						Fingerprint
					</button>
				</li>
			</ul>
		</nav>
	);
}

export default Nav;
