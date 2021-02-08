import React from "react";
import { Grid } from "semantic-ui-react";

export const Frame = props => {

	// Bring in prop details.
	const { player, index, frameState } = props;
								
	// Evaluate valid digits. TODO: This will essentially be where our presented-results refactor ends up, so all the backend uses real numbers.
	const bracketValuation = (bracket) => {
		return frameState[bracket]
				? frameState[bracket]
				: frameState[bracket] <= 10 
					? frameState[bracket]
					: '';
	};

	// Establish values to be read later.
	const bracket1Value = bracketValuation('b1');
	const bracket2Value = bracketValuation('b2');
	const bracket3Value = bracketValuation('b3');

	// Return the component, with appropriately unique keys, and user-standard formatted results.
	return (
		<Grid.Column width={1} className={`bhFrame bHFrame${index}`}>
					<Grid className="bHFrameGrid">
						<Grid.Row columns={3} className="bHFrameTop">
							<Grid.Column key={`player${player}f${index}b1`} width={5} className="bHFrameBracket1">{bracket1Value}</Grid.Column>
							<Grid.Column key={`player${player}f${index}b2`} width={5} className="bHFrameBracket2">{bracket2Value}</Grid.Column>
							{(props.index === 10) && 
								<Grid.Column key={`player${player}f${index}b3`} width={6} className="bHFrameBracket2">{bracket3Value}</Grid.Column>
							}
						</Grid.Row>
						<Grid.Row columns={1}>
							<Grid.Column className="bHFrameScore">{frameState.score}</Grid.Column>
						</Grid.Row>
					</Grid>
		</Grid.Column>
	)
};