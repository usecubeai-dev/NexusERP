export type Stat = {
	label: string;
	value: string;
	color: string;
};

export type ProductLaunchProps = {
	productName: string;
	tagline: string;
	stats: Stat[];
	accentColor: string;
	backgroundColor: string;
};

export const productLaunchDefaultProps: ProductLaunchProps = {
	productName: 'NexusERP',
	tagline: 'Unify your business. Amplify your growth.',
	accentColor: '#6366f1',
	backgroundColor: '#0f0f1a',
	stats: [
		{label: 'Faster Invoicing', value: '3×', color: '#6366f1'},
		{label: 'Cost Reduction', value: '40%', color: '#22d3ee'},
		{label: 'Integrations', value: '120+', color: '#f472b6'},
		{label: 'Uptime SLA', value: '99.9%', color: '#4ade80'},
	],
};
