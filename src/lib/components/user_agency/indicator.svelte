<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // 3 status: match, medium, mismatch
    export let status = "match";
    export let currentView;

    let views = [
		"ChoroplethMap",
		"HexMap",
		"Vertical WaffleChart",
		"Horizontal WaffleChart"
	]

    let buttonColor;
    $: buttonColor = status === "match" ? "green" : "#D25F00";

    let buttonText = "Try Another View";
    $: buttonText;

    let tipsText = "";
    $: tipsText;
    $: {
        if(status == "match"){
            buttonText = "Try another view";
            tipsText = generateTips();
        } else {
            buttonText = "Check the detail"
            tipsText = generateTips();
        }
    }



    function generateTips() {
        if (status == "match") {
            return `${views[currentView]} is the currently most suitable view. You can use try other views to get different insight from data.`
        } else {
            return `A more suitable view is available.`
        }
    }

    function handleClick() {
        dispatch("indicator-clicked");
    }

</script>

<div class="container">
    <p class="tips" style:color={buttonColor}>{tipsText}</p>
    <button class="my-button" on:click={handleClick}> {buttonText}</button>
</div>


<style>
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
    }

    .tips {
        font-size: 12px;
        font-weight: bold;
    }

    .my-button {
        font-weight: bold;
        background-color: #858585;
		color: white;
		border: 1px solid #858585;
		border-radius: 4px;
		text-align: center;
		display: inline-block;
		font-size: 12px;
		margin: 4px 2px;
		cursor: pointer;
    }

</style>