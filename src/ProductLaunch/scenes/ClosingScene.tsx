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
	accentColor: string;
};

export const ClosingScene: React.FC<Props> = ({productName, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoScale = spring({fps, frame, config: {damping: 60, stiffness: 150}});

	const ctaOpacity = interpolate(frame, [20, 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const ctaY = interpolate(frame, [20, 40], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const ringScale = interpolate(frame, [0, 60], [0.8, 1.6], {
		extrapolateRight: 'clamp',
	});
	const ringOpacity = interpolate(frame, [0, 20, 60], [0, 0.4, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 32,
			}}
		>
			{/* Expanding ring pulse */}
			<AbsoluteFill
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					pointerEvents: 'none',
				}}
			>
				<div
					style={{
						width: 400,
						height: 400,
						borderRadius: '50%',
						border: `3px solid ${accentColor}`,
						opacity: ringOpacity,
						transform: `scale(${ringScale})`,
					}}
				/>
			</AbsoluteFill>

			{/* Logo / wordmark */}
			<div
				style={{
					transform: `scale(${logoScale})`,
					fontSize: 110,
					fontWeight: 900,
					color: '#ffffff',
					letterSpacing: '-3px',
				}}
			>
				<span style={{color: accentColor}}>{productName[0]}</span>
				{productName.slice(1)}
			</div>

			{/* CTA */}
			<div
				style={{
					opacity: ctaOpacity,
					transform: `translateY(${ctaY}px)`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 8,
				}}
			>
				<div
					style={{
						fontSize: 28,
						color: 'rgba(255,255,255,0.6)',
						fontWeight: 300,
						letterSpacing: '1px',
					}}
				>
					Comece seu teste gratuito hoje
				</div>
				<div
					style={{
						fontSize: 22,
						color: accentColor,
						fontWeight: 600,
						letterSpacing: '2px',
					}}
				>
					nexuserp.io
				</div>
			</div>
		</AbsoluteFill>
	);
};
