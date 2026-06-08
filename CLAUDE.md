# Aplicativo de Vídeo com Remotion

Este é um aplicativo de vídeo baseado em Remotion que usa React para renderizar vídeos.

A documentação completa do Remotion está disponível em: https://www.remotion.dev/docs/. Consulte com frequência em caso de dúvidas.

### Estrutura do Projeto

O arquivo raiz geralmente se chama "src/Root.tsx" e tem a seguinte aparência:

```
import {Composition} from 'remotion';
import {MyComp} from './MyComp';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={120}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};
```

Um `<Composition>` define um vídeo que pode ser renderizado. Ele é composto por um React "component", um "id", um "durationInFrames", um "width", um "height" e uma taxa de quadros "fps". A taxa de quadros padrão deve ser 30. A altura padrão deve ser 1080 e a largura padrão deve ser 1920. O "id" padrão deve ser "MyComp". O "defaultProps" deve ter o formato das props React que o "component" espera.

Dentro de um React "component", é possível usar o hook "useCurrentFrame()" para obter o número do quadro atual. A numeração dos quadros começa em 0.

```
export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	return <div>Quadro {frame}</div>;
};
```

### Regras de Componentes

Dentro de um componente, é possível retornar tags HTML e SVG normais. Existem tags especiais para vídeo e áudio. Essas tags especiais aceitam estilos CSS normais.

Se um vídeo for incluído no componente, deve-se usar a tag `<OffthreadVideo>`.

```
import {OffthreadVideo} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<div>
			<OffthreadVideo
				src="https://remotion.dev/bbb.mp4"
				style={{width: '100%'}}
			/>
		</div>
	);
};
```

OffthreadVideo possui uma prop "startFrom" que corta o início de um vídeo por um número de quadros. OffthreadVideo possui uma prop "endAt" que limita por quanto tempo o vídeo é exibido. OffthreadVideo possui uma prop "volume" que define o volume do vídeo. Aceita valores entre 0 e 1.

Se uma imagem não animada for incluída no componente, deve-se usar a tag `<Img>`.

```
import {Img} from 'remotion';

export const MyComp: React.FC = () => {
	return <Img src="https://remotion.dev/logo.png" style={{width: '100%'}} />;
};
```

Se um GIF animado for incluído, o pacote "@remotion/gif" deve ser instalado e a tag `<Gif>` deve ser usada.

```
import {Gif} from '@remotion/gif';

export const MyComp: React.FC = () => {
	return (
		<Gif
			src="https://media.giphy.com/media/l0MYd5y8e1t0m/giphy.gif"
			style={{width: '100%'}}
		/>
	);
};
```

Se áudio for incluído, deve-se usar a tag `<Audio>`.

```
import {Audio} from 'remotion';

export const MyComp: React.FC = () => {
	return <Audio src="https://remotion.dev/audio.mp3" />;
};
```

As fontes dos assets podem ser especificadas como uma URL remota ou como um asset referenciado da pasta "public/" do projeto. Se um asset for referenciado da pasta "public/", deve-se especificá-lo usando a API "staticFile" do Remotion.

```
import {Audio, staticFile} from 'remotion';

export const MyComp: React.FC = () => {
	return <Audio src={staticFile('audio.mp3')} />;
};
```

O áudio possui uma prop "startFrom" que corta o início do áudio por um número de quadros. O áudio possui uma prop "endAt" que limita por quanto tempo o áudio é reproduzido. O áudio possui uma prop "volume" que define o volume. Aceita valores entre 0 e 1.

Se dois elementos precisam ser renderizados um sobre o outro, eles devem ser sobrepostos usando o componente "AbsoluteFill" do "remotion".

```
import {AbsoluteFill} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'blue'}}>
				<div>Este fica atrás</div>
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'blue'}}>
				<div>Este fica na frente</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
```

Qualquer elemento pode ser envolvido em um componente "Sequence" do "remotion" para posicioná-lo mais tarde no vídeo.

```
import {Sequence} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<Sequence from={10} durationInFrames={20}>
			<div>Este só aparece após 10 quadros</div>
		</Sequence>
	);
};
```

A Sequence possui uma prop "from" que especifica o número do quadro onde o elemento deve aparecer. A prop "from" pode ser negativa; nesse caso, a Sequence começa imediatamente, mas corta os primeiros "from" quadros.

A Sequence possui uma prop "durationInFrames" que especifica por quantos quadros o elemento deve aparecer.

Se um componente filho de Sequence chamar "useCurrentFrame()", a contagem começa a partir do primeiro quadro em que a Sequence aparece, iniciando em 0.

Para exibir múltiplos elementos em sequência, o componente "Series" do "remotion" pode ser usado.

```
import {Series} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<Series>
			<Series.Sequence durationInFrames={20}>
				<div>Este aparece imediatamente</div>
			</Series.Sequence>
			<Series.Sequence durationInFrames={30}>
				<div>Este aparece após 20 quadros</div>
			</Series.Sequence>
		</Series>
	);
};
```

Para transições, o componente "TransitionSeries" do "@remotion/transitions" pode ser usado.

O Remotion exige que todo o código React seja determinístico. Portanto, é proibido usar a API Math.random(). Use a função "random()" do "remotion" passando uma semente estática.

O Remotion inclui um helper `interpolate()` para animar valores ao longo do tempo:

```
import {interpolate} from 'remotion';

const value = interpolate(frame, [0, 100], [0, 1], {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
});
```

O Remotion inclui um helper `spring()` para animações baseadas em física:

```
import {spring} from 'remotion';

const value = spring({
	fps,
	frame,
	config: {damping: 200},
});
```

### Criando Componentes de UI

Os componentes Remotion são fundamentalmente diferentes dos componentes React interativos normais:

- São renderizados quadro a quadro para criar vídeos
- Não podem ter interações do usuário (sem onClick, onHover, etc.)
- Não podem usar hooks como useState para interatividade
- Devem ser determinísticos — a mesma entrada sempre produz a mesma saída
- As animações são controladas pelo número do quadro atual
- Evite useEffect — os cálculos devem ser puros com base no quadro
