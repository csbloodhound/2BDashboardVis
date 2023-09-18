<script>
	export let width, height;
	export let landscapeOverlay;
	export let viewLandscape;
	import "carbon-components-svelte/css/white.css";
	import { Checkbox } from "carbon-components-svelte";

	$: width;
	$: height;

	let divAR, divArea;

	$: divAR = Math.round((width / height) * 100) / 100;
	$: divArea = Math.round(width * height);
</script>

<div id="controls">
	<p>
		Resize the container using the handle in the botton right and watch the visualization update
			(Chrome/Firefox only).
	</p>

	<p>
		拖拽画布右下方的来观察可视化在不同尺寸下的变化 (推荐使用Chrome/Firefox浏览器).
	</p>

	<br>

	<ul>	
		<li>width : {width} px</li>
		<li>height : {height} px</li>
		<li>Aspect ratio : {divAR}</li>
		<li />
	</ul>
	

	<p>
		<Checkbox labelText="Show Breakpoints (显示断点)" bind:checked={landscapeOverlay} id="overlay"/>
	</p>
</div>

<style>
	#controls {
		/* line-height: 1rem; */
		margin-bottom: 0.3rem;
	}
	p,
	ul {
		margin: 0;
		line-height: 1.3rem;
		font-weight: 400;
	}
	input {
		margin: 0 5px 7px 0;
	}
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: inline-block;
	}
	li {
		display: inline-block;
		width: 150px;
	}
	button {
		background-color: white;
		color: black;
		border: 2px solid #bebada;
		border-radius: 2rem;
		padding: 0.25rem 0.5rem 0.15rem 0.5rem;
		font-size: 0.8rem;
		transition-duration: 0.3s;
	}
	button:hover {
		background-color: #bebada;
	}
</style>
