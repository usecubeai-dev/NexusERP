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
	tagline: 'Unifique seu negócio. Amplifique seu crescimento.',
	accentColor: '#6366f1',
	backgroundColor: '#0f0f1a',
	stats: [
		{label: 'Faturamento mais rápido', value: '3×', color: '#6366f1'},
		{label: 'Redução de custos', value: '40%', color: '#22d3ee'},
		{label: 'Integrações', value: '120+', color: '#f472b6'},
		{label: 'SLA de disponibilidade', value: '99,9%', color: '#4ade80'},
	],
};
