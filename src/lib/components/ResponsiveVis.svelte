<script>
	import { range, schemeSet3 } from 'd3';
	import { afterUpdate, onMount } from 'svelte';
	import Indicator from './user_agency/indicator.svelte';
	import UserAgency from './user_agency/UserAgency.svelte';
	import SuggestionsGenerator from './user_agency/SuggestiongGenerator';


	let views = [
		"ChoroplethMap",
		"Hexmap",
		"WaffleChart",
		"WaffleChart"
	];

	// calcualte the number of elements conflicting the view condition
	let count = 0;
	$: count;

	let status = "match";
	let bestViewIndex = 0;
	let currentViewIndex = 0;
	let popUpState = false;
	$: status;
	$: bestViewIndex;
	$: currentViewIndex;


	let display = undefined;
	let prevDisplay = null; // a variable to store the previous value of display
	let display_change = 0;
	let finalDisplay;
	$: finalDisplay;

	let suggestion = {
		conditionIssue: "The minimum area in this ChoroplethMap is now less than 2px, which means small urban constituencies being undetectable when scaled down",
		suggestedReason: "We recommend you to use Hex map, representing each constituency as a hexagon of the same size",
		treadoff: "However, Hex map loses geographical boundary information."
	};
	$: suggestion;

	export let spec; // must be provided and contains data and parameters for each view state
	export let computeViewLandscape = true;
	export let width, height, viewLandscape; // can optionally be used on the page via e.g. bind:width={...}
	export let vlInterval = 1; // how detailed should the view landscape be calculated

	// initialize SuggestionsGenerator
	let SugGenerator = new SuggestionsGenerator(spec);

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
	}

	$: {
		if (prevDisplay !== null && display !== prevDisplay && display_change > 3) {
			bestViewIndex = display;
		}
		prevDisplay = display;
	}

	$: status = currentViewIndex === bestViewIndex ? 'match' : currentViewIndex < bestViewIndex ? 'mismatch' : 'medium';
	$: {
		SugGenerator.generateSuggestions(currentViewIndex, bestViewIndex, count);
		suggestion = SugGenerator.suggestions;
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

	function handleIndicatorClicked(e) {
		popUpState = true;
	}
	
</script>

<div id="outer-container">
	<div style="display: flex; gap: 16px">
		<div
			id="container"
			style="width:{spec.initSize.w}px; height:{spec.initSize.h}px; max-width:{spec.maxSize
				.w}px; max-height:{spec.maxSize.h}px; min-width:{spec.minSize.w}px; min-height:{spec.minSize
				.h}px"
			bind:offsetWidth={width}
			bind:offsetHeight={height}
		>
			<Indicator 
				status={status} 
				on:indicator-clicked={handleIndicatorClicked}
				currentView={currentViewIndex}
				bestView={bestViewIndex}
			> </Indicator>
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
					display={currentViewIndex === i}
					bind:checkConditions={checkConditions[i]}
					bind:count={count}
				/>
			{/each}
		</div>
		<UserAgency 
			bestView={bestViewIndex} 
			bind:popUpState={popUpState} 
			bind:currentView={currentViewIndex}
			suggestion={suggestion}
			>
		</UserAgency>
	</div>
	<!-- slot for optional overlay -->
	<slot />
</div>

<style>
	#outer-container {
		position: relative;
	}
	#container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		resize: both;
		position: relative;	
		border: 0.5px solid #c7cace;
		background-color: #fff;
		box-shadow: 0 2px 8px 0 rgba(0,0,0,0.2);
		transition: 0.3s;
		border-radius: 5px;
		background-color: #fafafa;
	}
</style>