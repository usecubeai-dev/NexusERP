import React from 'react';
import {Composition} from 'remotion';
import {ProductLaunch} from './ProductLaunch/ProductLaunch';
import {productLaunchDefaultProps} from './ProductLaunch/types';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="ProductLaunch"
				component={ProductLaunch}
				durationInFrames={300}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={productLaunchDefaultProps}
			/>
		</>
	);
};
