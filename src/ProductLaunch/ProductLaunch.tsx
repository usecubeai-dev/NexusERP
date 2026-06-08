import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import type {ProductLaunchProps} from './types';
import {HeroScene} from './scenes/HeroScene';
import {StatsScene} from './scenes/StatsScene';
import {ClosingScene} from './scenes/ClosingScene';

export const ProductLaunch: React.FC<ProductLaunchProps> = ({
	productName,
	tagline,
	stats,
	accentColor,
	backgroundColor,
}) => {
	return (
		<AbsoluteFill style={{backgroundColor, fontFamily: 'sans-serif'}}>
			<Series>
				<Series.Sequence durationInFrames={120}>
					<HeroScene
						productName={productName}
						tagline={tagline}
						accentColor={accentColor}
					/>
				</Series.Sequence>
				<Series.Sequence durationInFrames={120}>
					<StatsScene stats={stats} accentColor={accentColor} />
				</Series.Sequence>
				<Series.Sequence durationInFrames={60}>
					<ClosingScene
						productName={productName}
						accentColor={accentColor}
					/>
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
