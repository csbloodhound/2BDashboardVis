<script>
	import { base } from '$app/paths';
	export let currentView = 0;
	export let bestView = 0;	
	export let popUpState = false;
	export let suggestion = {
		conditionIssue: "The minimum area in this ChoroplethMap is now less than 2px, which means small urban constituencies being undetectable when scaled down",
		suggestedReason: "We recommend you to use Hex map, representing each constituency as a hexagon of the same size",
		treadoff: "However, Hex map loses geographical boundary information."
	}

	let layout;
	$: if (currentView != bestView) {
		layout = "plan_A";
	} else {
		layout = "plan_B";
	}

	let views = [
		"ChoroplethMap",
		"HexMap",
		"Vertical WaffleChart",
		"Horizontal WaffleChart"
	]

	let imgs = [
		`${base}/img/ChoroplethMap.png`,
		`${base}/img/HexMap.png`,
		`${base}/img/WaffleChart.png`,
		`${base}/img/WaffleChart.png`,
	]

	let close_img = `${base}/img/Close.png`

	$: remainingViews = views.filter((view, index) => index != currentView && index != bestView);
	$: remainingViewsWhenMatch = views.filter((view, index) => index != bestView);

	const handleBestView = () => {
		currentView = bestView;
		popUpState = false;
	}
	
	const handleClose = () => {
		popUpState = false;
	}

	const handleRemainingView = (e) => {
		let index = views.indexOf(e.target.innerHTML);
		currentView = index;
		popUpState = false;
	}

</script>

{#if popUpState}
	{#if layout === "plan_A"}
		<div style="width: fit-content;">
			<div class="suggestion-container">
				<button class="close-button" on:click={handleClose}>
					<img src={close_img} width="20px" alt="not found">
				</button>
				<div class="best-view-container">
					<div class="recommend" style="width: auto;">
						<img class="best-view-img" src={imgs[bestView]} alt="img not found">
						<button class="best-view-confirm" on:click={handleBestView}>{views[bestView]}</button>
					</div>
					<div class="suggestion" style="width: 300px;">
						{#if currentView < bestView}
							<div class="suggestion-detail">
								<p style="font-size: 14px; font-weight: bold; color: #CB2634">We recommend that you change the current view.</p>
								<p style="font-size: 12px; color: #CB2634">
									{suggestion.conditionIssue}
								</p>
							</div>
						{/if}
						<div class="suggestion-detail">
							<p style="font-size: 14px; font-weight: bold; color: #009A29">We recommend that you switch to the {views[bestView]} view</p>
							<p style="font-size: 12px; color: #009A29">
								{suggestion.suggestedReason}
							</p>
						</div>
						{#if suggestion.treadoff.trim()}
							<div class="suggestion-detail">
								<p style="font-size: 14px; font-weight: bold; color: #D25F00">Before switch, something you need to know</p>
								<p style="font-size: 12px; color: #D25F00">
									{suggestion.treadoff}
								</p>
							</div>
						{/if}
					</div>
				</div>
				<div class="alt-buttons">
					<button class="common-button" on:click={handleRemainingView}>{remainingViews[0]}</button>
					<button class="common-button"on:click={handleRemainingView}>{remainingViews[1]}</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="idea-situation"> 
			<div style="display: flex; flex-direction:row; justify-content: flex-end;">
				<button class="close-button" on:click={handleClose}>
					<img src={close_img} width="20px" alt="not found">
				</button>
			</div>
			<div style="display: flex; flex-direction: column; gap: 4px">
				<div style="width: 400px; word-wrap: break-word; font-size: 16px; text-align: left; color: #12ad39; font-weight: bold;">
					The current view is the most suitable one.
				</div>
				<div style="width: 400px; word-wrap: break-word; font-size: 16px; text-align: left; color: #656D7D;">
					You can also try other views.
				</div>
			</div>
			<div class="alt-buttons">
				<button class="common-button" on:click={handleRemainingView}>{remainingViewsWhenMatch[0]}</button>
				<button class="common-button" on:click={handleRemainingView}>{remainingViewsWhenMatch[1]}</button>
				<button class="common-button" on:click={handleRemainingView}>{remainingViewsWhenMatch[2]}</button>
			</div>
		</div>
	{/if}
{/if}

<style>
	.recommend {
		display: flex;
		flex-direction: column;
	}

	.best-view-confirm{
		width: 150px;
	}
	
	.best-view-img {
		width: 150px;
		height: 150px;
	}

	.best-view-container{
		display: flex;
		gap: 16px;
	}

	.suggestion-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 1em;
		box-shadow: 0 2px 8px 0 rgba(0,0,0,0.2);
		transition: 0.3s;
		border-radius: 5px;
		padding: 20px;
		background-color: #fafafa;
		width: auto;
	}

	.suggestion-container:hover {
		box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
	}

	.best-view-img {
		max-width: 100%;
		height: auto;
		border-radius: 5px;
	}

	.suggestion-container {
		padding: 1em;
		margin-bottom: 1em;
	}

	.common-button {
		background-color: #3f51b5;
		color: white;
		border: 1px solid #3f51b5;
		border-radius: 4px;
		padding: 10px 24px;
		text-align: center;
		display: inline-block;
		font-size: 12px;
		margin: 4px 2px;
		cursor: pointer;
	}

	button:hover {
		background-color: white; 
		color: #3f51b5; 
		border: 1px solid #3f51b5;
	}

	.best-view-confirm {
		background-color: #12ad39;
		color: white;
		border: 1px solid #12ad39;
		border-radius: 4px;
		padding: 10px 24px;
		text-align: center;
		display: inline-block;
		font-size: 12px;
		margin: 4px 2px;
		cursor: pointer;
	}

	.best-view-confirm:hover {
		background-color: white; 
		color: #12ad39; 
		border: 1px solid #12ad39;
	}

	.alt-buttons{
		display: flex;
		flex-direction: column;
	}

	.idea-situation {
		display: inline-flex;
		flex-direction: column;
		gap: 12px;
		box-shadow: 0 2px 8px 0 rgba(0,0,0,0.2);
		transition: 0.3s;
		border-radius: 5px;
		padding: 8px;
		background-color: #fafafa;
		width: fit-content;
		height: fit-content;
	}

	.close-button {
		display: flex;
  		justify-content: flex-end;
		margin: 0;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.close-button img {
		display: block;
		width: 20px;
	}
	
	.close-button:hover {
  		background: none;
		border: none;
	}
</style>