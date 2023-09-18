<script>
	import { range, schemeOrRd, schemeSet3 } from 'd3';
	import { afterUpdate, onMount } from 'svelte';
	import Modal from './Modal.svelte';
	import ViewController from '../auxiliary_class/ViewController';

	let viewController = new ViewController();

	let detailedDesc = [
		"The minimum area in this ChoroplethMap is now less than 2px, which means small urban constituencies being undetectable when scaled down",
		"The minimum hexagonal area in this Hexmap is now less than 5px",
		"The maximum aspect ratio is larger that 1"
	]

	let views = [
		"ChoroplethMap",
		"Hexmap",
		"WaffleChart",
		"WaffleChart"
	];

	let test;
	$: test;

	let current_desc;
	$ : current_desc;

	let show = false;
	$: show;

	let display = undefined;
	let prevDisplay = null; // a variable to store the previous value of display
	let display_change = 0;
	let finalDisplay;
	$: finalDisplay;

	const handleModalCancel = () => {
		viewController.modeSwitch(show, "cancel");
		viewController.setFinalDisplay(display);
		finalDisplay = viewController.finalDisplay;
		show = false;
		console.log("the mode is :" + viewController.mode);
	}

	const handleModalConfirm = () => {
		viewController.modeSwitch(show, "confirm");
		viewController.setFinalDisplay(display);
		finalDisplay = viewController.finalDisplay;
		show = false;
		console.log("the mode is :" + viewController.mode);
	}

	export let spec; // must be provided and contains data and parameters for each view state
	export let computeViewLandscape = true;
	export let width, height, viewLandscape; // can optionally be used on the page via e.g. bind:width={...}
	export let vlInterval = 1; // how detailed should the view landscape be calculated

	// set color scheme for view landscape
	const vlColors = schemeSet3;

	// default parameters
	$: spec.initSize = spec.initSize ? spec.initSize : { w: 600, h: 400 }; 
	$: spec.maxSize = spec.maxSize ? spec.maxSize : { w: 1000, h: 700 };
	$: spec.minSize = spec.minSize ? spec.minSize : { w: 50, h: 50 };

	// store the functions that can check the conditions into an array
	let checkConditions = Array(spec.views.length).fill(undefined);
	$: checkConditions;

	// condition is a boolean variable that is true if the view state should be displayed  
	let conditions = Array(spec.views.length).fill(true); // intialise array with TRUE for each view state
	$: conditions = conditions.map((d, i) => {
			return typeof checkConditions[i] === 'function' ? checkConditions[i](width, height) : true;
		});

	$: {
		display = conditions.findIndex((d) => d);
		display_change = display_change + 1;
		if (display_change <= 4) {
			viewController.setFinalDisplay(display);
		}
		finalDisplay = viewController.finalDisplay;
	}

	// Show the Modal
	$: {
		if (prevDisplay !== null && display !== prevDisplay && display_change > 3) {
			viewController.setFinalDisplay(display);
			finalDisplay = viewController.finalDisplay;
			if (display > prevDisplay){
				current_desc = detailedDesc[prevDisplay];
				show = true;
			} else {
				if (viewController.mode != "user") {
					current_desc = "There is a more detailed view";
					show = true;
				}
			}
			viewController.setPrevDisplay(prevDisplay);
		}
		prevDisplay = display;
	}

	let mounted = false;
	$: mounted;
	onMount(() => {
		mounted = true;
	});

	afterUpdate(() => {
		if (computeViewLandscape) {
			updateViewLandscape();
		}
	});

	// update the landscape
	function updateViewLandscape() {
		let w = spec.maxSize.w;
		let h = spec.maxSize.h;

		// get an array of max width by max height that records which view state is displayed at each size
		// Example:
		// 1 1 1 1 2 2 2 2 
		// 1 1 1 2 2 2 2 2 
		// 1 1 1 2 2 2 2 2 
		let arr = range(0, w, vlInterval).map((x) => {
			return range(0, h, vlInterval).map((y) => {
				for (let i = 0; i < spec.views.length; i++) {
					if (checkConditions[i](x, y)) {
						return i;
					}
				}
			});
		});

		// draw this array on a canvas
		let canvas = document.createElement('canvas');
		canvas.id = "background-canvas";
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);

		// c is like a paintbrush
		let c = canvas.getContext('2d');
		for (let x = 0; x < arr.length; x++) {
			for (let y = 0; y < arr[0].length; y++) {
				c.fillStyle = typeof arr[x][y] == 'number' ? vlColors[arr[x][y]] : '#fff';
				c.fillRect(x * vlInterval, y * vlInterval, vlInterval, vlInterval);
			}
		}

		let dataURL = canvas.toDataURL();

		viewLandscape = { mode: 'dynamic', dataArray: arr, dataURL, size: [w, h] };
	}

</script>

<div style="display: flex; flex-direction: row">
	<div id="outer-container">
		<div
			id="container"
			style="width:{spec.initSize.w}px; height:{spec.initSize.h}px; max-width:{spec.maxSize
				.w}px; max-height:{spec.maxSize.h}px; min-width:{spec.minSize.w}px; min-height:{spec.minSize
				.h}px"
			bind:offsetWidth={width}
			bind:offsetHeight={height}
		>
			{#each spec.views as view, i}
				<svelte:component
					this={view.type}
					data={view.data}
					params={view.params}
					conditions={view.conditions} 
					context={{
						width,
						height,
						spec
					}}
					display={finalDisplay === i}
					bind:checkConditions={checkConditions[i]}
				/>
			{/each}
		</div>
		<!-- slot for optional overlay -->
		<slot />
	</div>
    <div id="modal">
		<Modal open={show} on:close={handleModalCancel} on:confirm={handleModalConfirm} desc={current_desc}
			display={finalDisplay} w={width} spec={spec}></Modal>
	</div>
</div>

<style>
	#outer-container {
		position: relative;
	}
	#container {
		overflow: hidden;
		resize: both;
		position: relative;	
		border: 1px solid #ccc;
		background-color: #fff;
	}
</style>

<!-- 
	1. The interpretation of props:
		- spec: specification for vegalite views. The view will not be displayed in this component, but in the view component itself.
		- computeViewLandscape: whether to compute the view landscape (default: true)
		- width, height: optional, can be used to set the initial size of the container
		- viewLandscape: optional, can be used to set the view landscape manually
		- vlInterval: how detailed should the view landscape be calculated (default: 1)
-->