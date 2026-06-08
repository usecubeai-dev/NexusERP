import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

type Props = {
	productName: string;
	tagline: string;
	accentColor: string;
};

export const HeroScene: React.FC<Props> = ({productName, tagline, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleScale = spring({fps, frame, config: {damping: 80, stiffness: 200}});
	const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
	});

	const taglineOpacity = interpolate(frame, [30, 55], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const taglineY = interpolate(frame, [30, 55], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const lineWidth = interpolate(frame, [50, 90], [0, 600], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const bgGlow = interpolate(frame, [0, 60], [0, 0.3], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{/* Radial glow background */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${accentColor}${Math.round(bgGlow * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
				}}
			/>

			{/* Product name */}
			<div
				style={{
					fontSize: 140,
					fontWeight: 900,
					color: '#ffffff',
					letterSpacing: '-4px',
					opacity: titleOpacity,
					transform: `scale(${titleScale})`,
					textAlign: 'center',
					lineHeight: 1,
				}}
			>
				{productName}
			</div>

			{/* Accent divider line */}
			<div
				style={{
					width: lineWidth,
					height: 4,
					borderRadius: 2,
					backgroundColor: accentColor,
					marginTop: 24,
					marginBottom: 32,
				}}
			/>

			{/* Tagline */}
			<div
				style={{
					fontSize: 42,
					fontWeight: 300,
					color: 'rgba(255,255,255,0.75)',
					letterSpacing: '1px',
					opacity: taglineOpacity,
					transform: `translateY(${taglineY}px)`,
					textAlign: 'center',
					maxWidth: 900,
				}}
			>
				{tagline}
			</div>
		</AbsoluteFill>
	);
};
