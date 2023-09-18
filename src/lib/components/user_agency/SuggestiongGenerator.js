class SuggestionsGenerator {
    constructor(spec) {
        this.views = spec.views;
        this.suggestions = {
            conditionIssue: "",
            suggestedReason: "",
            treadoff: ""
        };
        this.tradeoffMatrix;
        this.fillTradeoffMatrix();
    }
    
    fillTradeoffMatrix() {
        this.tradeoffMatrix = new Array(this.views.length);
        for (let i = 0; i < this.views.length; i++) {
            this.tradeoffMatrix[i] = new Array(this.views.length);
            for (let j = 0; j < this.views.length; j++) {
                this.tradeoffMatrix[i][j] = '';
            }
        }
        this.tradeoffMatrix[0][1] = "However, Hex map may lose geographical boundary information.";
        this.tradeoffMatrix[1][2] = `However, Waffle Chart will lose a lot of geographical location information. 
                                    Moreover, the legends will be removed, reducing your abilities to find the information. 
                                    Besides, it will hamper comparisons between some regions, since the information is no longer visible within a single scroll height of you display`;
        this.tradeoffMatrix[1][3] = "However, Waffle Chart will lose a lot of geographical location information. Moreover, the legends will be removed, reducing your abilities to find the information.";
    }

    generateSuggestions(currentView, bestView, count) {
        let currentSug = this.views[currentView].viewSugData;
        let bestSug = this.views[bestView].viewSugData;

        if (currentView == bestView) {
            this.suggestions = {
                conditionIssue: "",
                suggestedReason: "",
                treadoff: ""
            };
            return;
        }
        if (currentView < bestView) {
            this.suggestions = {
                conditionIssue: 
                    `${currentSug.fadingElement} in ${currentSug.viewName} ${currentSug.operator} 
                    ${currentSug.threshold}, which means ${currentSug.issue}`,
                suggestedReason:
                    `${bestSug.advantage}`,
                treadoff: this.tradeoffMatrix[currentView][bestView]
            };
            return;
        } else {
            this.suggestions = {
                suggestedReason:`There is a more detailed view (${bestSug.viewName}) you can use, since ${bestSug.advantage}`,
                treadoff: ""
            };
            return;
        }
    }

}

export default SuggestionsGenerator;