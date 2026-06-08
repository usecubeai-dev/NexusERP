import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import type {Stat} from '../types';

type Props = {
	stats: Stat[];
	accentColor: string;
};

const StatCard: React.FC<{stat: Stat; index: number}> = ({stat, index}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const delay = index * 15;
	const delayedFrame = Math.max(0, frame - delay);

	const cardScale = spring({
		fps,
		frame: delayedFrame,
		config: {damping: 100, stiffness: 180},
	});

	const valueOpacity = interpolate(delayedFrame, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				transform: `scale(${cardScale})`,
				opacity: valueOpacity,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: 340,
				height: 280,
				borderRadius: 24,
				backgroundColor: 'rgba(255,255,255,0.05)',
				border: `2px solid ${stat.color}44`,
				padding: '32px 24px',
				gap: 16,
			}}
		>
			<div
				style={{
					fontSize: 96,
					fontWeight: 900,
					color: stat.color,
					lineHeight: 1,
					letterSpacing: '-2px',
				}}
			>
				{stat.value}
			</div>
			<div
				style={{
					fontSize: 26,
					fontWeight: 500,
					color: 'rgba(255,255,255,0.7)',
					textAlign: 'center',
				}}
			>
				{stat.label}
			</div>
		</div>
	);
};

export const StatsScene: React.FC<Props> = ({stats, accentColor}) => {
	const frame = useCurrentFrame();

	const headerOpacity = interpolate(frame, [0, 25], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const headerY = interpolate(frame, [0, 25], [-40, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 60,
			}}
		>
			{/* Section header */}
			<div
				style={{
					opacity: headerOpacity,
					transform: `translateY(${headerY}px)`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 12,
				}}
			>
				<div
					style={{
						fontSize: 20,
						fontWeight: 600,
						color: accentColor,
						letterSpacing: '4px',
						textTransform: 'uppercase',
					}}
				>
					Em números
				</div>
				<div
					style={{
						fontSize: 58,
						fontWeight: 800,
						color: '#ffffff',
						letterSpacing: '-1px',
					}}
				>
					Resultados que importam
				</div>
			</div>

			{/* Stats grid */}
			<Sequence from={20}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 32,
						flexWrap: 'wrap',
						justifyContent: 'center',
					}}
				>
					{stats.map((stat, i) => (
						<StatCard key={stat.label} stat={stat} index={i} />
					))}
				</div>
			</Sequence>
		</AbsoluteFill>
	);
};
