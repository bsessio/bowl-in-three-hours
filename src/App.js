import React, { useState } from 'react';
import { Grid, Card, Input, Button, Modal } from 'semantic-ui-react';
import { Frame } from './components/Frame';
import logo from './logo.svg';
import './App.css';

function App() {
	// Instantiate a defaultState with all of the bare bones, just so we can clean reset. This is not optimal, but an easy way to clear the settings.
	const defaultState = {
		score1: {
			f1: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f2: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f3: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f4: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f5: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f6: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f7: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f8: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f9: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f10: {
				score: undefined,
				b1: undefined,
				b2: undefined,
				b3: undefined
			},
			fAll: {
				attempts: 2,
				currentPlayer: true,
				spare: undefined,
				strikes: {
					first: { frame: undefined, throws: [] },
					second: { frame: undefined, throws: [] },
					third: { frame: undefined, throws: [] },
				},
				pinsRemaining: 10,
				frame: 1,
				bracket: 1,
			},
		},
		score2: {
			f1: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f2: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f3: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f4: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f5: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f6: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f7: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f8: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f9: {
				score: undefined,
				b1: undefined,
				b2: undefined
			},
			f10: {
				score: undefined,
				b1: undefined,
				b2: undefined,
				b3: undefined
			},
			fAll: {
				attempts: 2,
				currentPlayer: false,
				spare: undefined,
				strikes: {
					first: { frame: undefined, throws: [] },
					second: { frame: undefined, throws: [] },
					third: { frame: undefined, throws: [] },
				},
				pinsRemaining: 10,
				frame: 1,
				bracket: 1,
				complete: false
			},
		}
	};

	// Begin state with defaultState settings.
	const [state, setState] = useState(defaultState);

	// Define the totals, so we can keep track, appending scores as we go.
	// TODO: This is hideous, autocompile an array and then find the highest value; if there is no value, return 0.
	// TODO: Aaaand it becomes painfully apparent that there is scoring collisions with strikes, while other scores advance, with them racing.
	const player1Total = !state?.score1?.f10?.score
							? !state?.score1?.f9?.score 
								? !state?.score1?.f8?.score 
									? !state?.score1?.f7?.score
										? !state?.score1?.f6?.score
											? !state?.score1?.f5?.score 
												? !state?.score1?.f4?.score
													? !state?.score1?.f3?.score 
														? !state?.score1?.f2?.score 
															? !state?.score1?.f1?.score 
																? 0
																: state?.score1?.f1?.score
															: state?.score1?.f2?.score
														: state?.score1?.f3?.score 
													: state?.score1?.f4?.score
												: state?.score1?.f5?.score
											: state?.score1?.f6?.score
										: state?.score1?.f7?.score
									: state?.score1?.f8?.score
								: state?.score1?.f9?.score
							: state?.score1?.f10?.score;

	// TODO: What the guy above said, but player2 time.
	const player2Total = !state?.score2?.f10?.score
							? !state?.score2?.f9?.score 
								? !state?.score2?.f8?.score 
									? !state?.score2?.f7?.score
										? !state?.score2?.f6?.score
											? !state?.score2?.f5?.score 
												? !state?.score2?.f4?.score
													? !state?.score2?.f3?.score 
														? !state?.score2?.f2?.score 
															? !state?.score2?.f1?.score 
																? 0
																: state?.score2?.f1?.score
															: state?.score2?.f2?.score
														: state?.score2?.f3?.score 
													: state?.score2?.f4?.score
												: state?.score2?.f5?.score
											: state?.score2?.f6?.score
										: state?.score2?.f7?.score
									: state?.score2?.f8?.score
								: state?.score2?.f9?.score
							: state?.score2?.f10?.score;

	// Generic score controller, which will be passed all relevant pieces it needs to make things happen. Ideally, for cleanliness, we'll make the setStates that go in it a function we pass to an utility we build in another folder, with those setState functions being a little more generic than they are.
	const scoreSettler = (player,frame,bracket,score) => {

		// For determining game status, we need the next player as well. This ... is not elegant, and an example of my current dreaded situation: I want to be able to scale player numbers past 2.
		const nextPlayer = player === 2 ? 1 : 2;
		// Grab the uncomfortable architecture above for scoring purposes, which has a known race condition issue.
		const currentPlayerScore = player === 2 ? player2Total : player1Total;

		// If we are on the second ball, we can basically always assume anything that is a valid number (<10) results in a basic frame.
		if(bracket === 2) {
			// Evaluating if a valid number
			if(score < 10 ) {
				// If so, we set the state...
				setState(state => ({ 
					...state,
					['score'+player]: { 
						...state['score'+player], 
						[`f`+frame]: { 
							// Adding the score of the current score, to the score in the last bracket's score, to the total score so we have a nice cumulative.
							...state['score'+player]['f'+frame],
							score: state['score'+player]['f'+frame].b1 + score + currentPlayerScore
						},
						fAll: { 
							...state['score'+player].fAll,
							// Then we check if we're done with the game.
							// TODO: Refactor this a little more appealingly.
							complete: frame === 10 	&& !state['score'+player].fAll.spare 
													&& !state['score'+player].fAll.strikes.first.frame 
													&& !state['score'+player].fAll.strikes.first.frame 
													&& !state['score'+player].fAll.strikes.first.frame 
													&& !state['score'+nextPlayer].fAll.spare 
													&& !state['score'+nextPlayer].fAll.strikes.first.frame 
													&& !state['score'+nextPlayer].fAll.strikes.first.frame 
													&& !state['score'+nextPlayer].fAll.strikes.first.frame 
												? true 
												: false 
						}
					}
				}));
			}
			// If the value is not a valid number, and we are in second bracket, we know we have a spare, so we go ahead and mark it's frame so we can come back to this.
			else {
				setState(state => ({
					...state,
					[`score`+player]: {
						...state[`score`+player],
						fAll: {
							...state[`score`+player].fAll,
							spare: `f${frame}`
						}
					}
				}))
			}
		};

		// If we already have a spare, we also need to now score that frame.
		// TODO: While this isn't appropriate here, this is the best place to tag this: Resolve final frame scoring.
		if(state['score'+player].fAll.spare) {
			const spareFrame = state['score'+player].fAll.spare;
			const spareScoring = score === 'X' ? 10 : score;

			setState(state => ({
				...state,
				['score'+player]: {
					...state['score'+player],
					[spareFrame]: {
						...state['score'+player][spareFrame],
						score: 10 + spareScoring + currentPlayerScore,
					},
					fAll: {
						// And then we remove the spare.
						...state['score'+player].fAll,
						spare: undefined
					}
				}
			}))
		};
	};

	// Now we manage the unique problem of strike scoring. NOTE: This is incomplete on two metrics.
	// TODO: Resolve the race condition that allows next-frame scoring ahead of strike.
	// TODO: Resolve final frame scoring.
	const strikeScorer = (strike, player) => {
		// We identify the player, add all the strike values together to score it, and identify the location of the strike for scoring.
		const currentPlayerScore = player === 2 ? player2Total : player1Total;
		const strikeTotal = state['score'+player].fAll.strikes[strike].throws.reduce((a, b) => a + b);
		const strikeFrame = state['score'+player].fAll.strikes[strike].frame;

		setState(state => ({
			...state,
			['score'+player]: {
				// When we go to score a strike, we evaluate where that strike needs to be scored, and score it.
				...state['score'+player],
				[strikeFrame]: {
					...state['score'+player][strikeFrame],
					score: strikeTotal + currentPlayerScore,
				},
				fAll: {
					// We then reset this strike sequence.
					...state['score'+player].fAll,
					strikes: {
						...state['score'+player].fAll.strikes,
						[strike]: {
							frame: undefined,
							throws: []
						}
					}
				}
			}
		}));
	}

	// Principle function - when you click bowl, it generates a number and handles what to do with it.
	const bowl = (playerNumber) => {
		// We establish the nextPlayer's info for looking ahead, and we isolate data as we will need later.
		const nextPlayerNumber = playerNumber === 2 ? 1 : 2;
		const currentPlayer = state['score'+playerNumber];
		const currentPlayerData = currentPlayer?.fAll;
		const { attempts, pinsRemaining: pins, frame, bracket } = currentPlayerData;

		// We want 12 total here for this calculation, as it goes from 0-11 with Math.random() on Math.floor(). This is great, as it allows 0 and 11 to serve as left and right boundaries.
		// We maintain both bowledScore and strikeThrow to capture presented data and values for strikes. 
		// TODO: Refactor to use strikeThrow logic more places, really, and present the 'X' just on the surface. That'd be cleaner and require less workarounds we've added throughout this project.
		// TODO: Add a 'Bumpers' function to allow for someone to play with trainers on, which only rolls based on pins, or maybe rerolls if result is 0 or 11 (less efficient but actually kind of weirdly more correct behavior).
		const bowledNumber = Math.floor(Math.random() * (2+pins));
		let bowledScore = 0;
		let strikeThrow = 0;

		// As above, 0 and 11 are gutterballs, 11 is a strike, and all else are their values. 
		switch(bowledNumber) {
			case 0:
			case 1: 
				bowledScore = 0;
				strikeThrow = 0;
				break;
			case 11:
				bowledScore = 'X';
				strikeThrow = 10;
				break;
			default:
				bowledScore = bowledNumber-1;
				strikeThrow = bowledNumber-1;
				break;
		};

		// Messy cleanups that will be fixed by a refactor that presents strikes and spares only to the visible client, while maintaining real digits in the backend.
		if(bowledScore === pins && bracket === 2) { bowledScore = '/'};
		if(bowledScore === 'X' && bracket === 2) { bowledScore = '/'};

		// The following three are Write Every Time functions that mark how many throws have been made on a strike, and what they are.
		// TODO: DRY the following three out, immediately.
		if(state['score'+playerNumber].fAll.strikes.third.frame) {
			setState(state => ({
				...state,
				['score'+playerNumber]: {
					...state['score'+playerNumber],
					fAll: {
						...state['score'+playerNumber].fAll,
						strikes: {
							...state['score'+playerNumber].fAll.strikes,
							third: {
								...state['score'+playerNumber].fAll.strikes.third,
								throws: [...state['score'+playerNumber].fAll.strikes.third.throws, strikeThrow]
							}
						}
					}
				}
			}))

			// And then it checks to see if we currently had two on the setState, and if so, knowing this is the third, runs the scorer. This is ... uncomfortable for me to read, as it implies 2, but we know it's slow. This reads poorly and would be a contender for a good refactor itself to make this succeed better. Late stage fix to get things vaguely working.
			if(state['score'+playerNumber].fAll.strikes.third.throws.length >= 2) {
				strikeScorer('third',playerNumber)
			}
		};

		// See above.
		if(state['score'+playerNumber].fAll.strikes.second.frame) {
			setState(state => ({
				...state,
				['score'+playerNumber]: {
					...state['score'+playerNumber],
					fAll: {
						...state['score'+playerNumber].fAll,
						strikes: {
							...state['score'+playerNumber].fAll.strikes,
							second: {
								...state['score'+playerNumber].fAll.strikes.second,
								throws: [...state['score'+playerNumber].fAll.strikes.second.throws, strikeThrow]
							}
						}
					}
				}
			}))


			if(state['score'+playerNumber].fAll.strikes.second.throws.length >= 2) {
				strikeScorer('second',playerNumber)
			}
		};

		// See above.
		if(state['score'+playerNumber].fAll.strikes.first.frame) {
			setState(state => ({
				...state,
				['score'+playerNumber]: {
					...state['score'+playerNumber],
					fAll: {
						...state['score'+playerNumber].fAll,
						strikes: {
							...state['score'+playerNumber].fAll.strikes,
							first: {
								...state['score'+playerNumber].fAll.strikes.first,
								throws: [...state['score'+playerNumber].fAll.strikes.first.throws, strikeThrow]
							}
						}
					}
				}
			}))


			if(state['score'+playerNumber].fAll.strikes.first.throws.length >= 2) {
				strikeScorer('first',playerNumber)
			}
		};

		// The actual strike listener function.
		if(bowledScore === 'X') {
			// The following three are pretty Write Every Time functions that look to see if this is a first strike, second strike, or third strike, and place it accordingly, with appropriate throws. 
			// Note that elsewhere we will track the actual score itself into pre-existing throws. This is likely able to be combined with the other function in a meaningful way, but it was working. Good candidate for re-evaluation.

			// If the Strike frame isn't declared, we know it needs to be established, as well as the throws array begun properly.
			if(!state['score'+playerNumber].fAll.strikes.first.frame) {
				setState(state => ({
					...state,
					['score'+playerNumber]: {
						...state['score'+playerNumber],
						fAll: {
							...state['score'+playerNumber].fAll,
							strikes: {
								...state['score'+playerNumber].fAll.strikes,
								first: {
									...state['score'+playerNumber].fAll.strikes.first,
									frame: `f${frame}`,
									throws: [strikeThrow]
								}
							}
						}
					}
				}));
			};

			// As above
			if(!state['score'+playerNumber].fAll.strikes.second.frame && state['score'+playerNumber].fAll.strikes.first.frame) {
				setState(state => ({
					...state,
					['score'+playerNumber]: {
						...state['score'+playerNumber],
						fAll: {
							...state['score'+playerNumber].fAll,
							strikes: {
								...state['score'+playerNumber].fAll.strikes,
								second: {
									...state['score'+playerNumber].fAll.strikes.second,
									frame: `f${frame}`,
									throws: [strikeThrow]
								}
							}
						}
					}
				}))
			};

			// As above
			if(!state['score'+playerNumber].fAll.strikes.third.frame && state['score'+playerNumber].fAll.strikes.second.frame) {
				setState(state => ({
					...state,
					['score'+playerNumber]: {
						...state['score'+playerNumber],
						fAll: {
							...state['score'+playerNumber].fAll,
							strikes: {
								...state['score'+playerNumber].fAll.strikes,
								third: {
									...state['score'+playerNumber].fAll.strikes.third,
									frame: `f${frame}`,
									throws: [strikeThrow]
								}
							}
						}
					}
				}))
			};
		};

		// As long as there are balls remaining for you to throw, you are eligible for some bowling action.
		// TODO: Utilify/modular function the actions below to make this DRY.

		// If attempts are better than 0, it is eligible.
		if(attempts > 0) {
			// We then reduce attempts appropriately, with a strike knocking us entirely out of attempts.
			// TODO: Change this behavior for the final frame. That was always the intention, but ran firmly out of time. This also requires the button-passing to work more successfully for these tricky last frames.
			setState(state => ({ 
				...state,
				['score'+playerNumber]: { 
					...state['score'+playerNumber], 
					[`f`+frame]: { 
						...state['score'+playerNumber]['f'+frame],
						[`b`+bracket]: bowledScore
					},
					fAll: { 
						...state['score'+playerNumber].fAll,
						// Attempts should go down by 1, unless a strike, or if we only have 1 attempt remaining, in which case it is 0.
						attempts: attempts === 2 
							? bowledScore === 'X' 
								? 0 
								: 1 
							: 0,
						// Some intentional structure for interacting with the third bracket, but not complete yet. TODO: Complete this functionality, along with the adjusted behavior above, and the button-passing mechanism.
						// If we are on attempt #1 (2 left at the time of this event, where we are resolving the first one still), we now change the upcoming bracket to bracket 2. If we are out of attempts, we reset to bracket 1... unless we are final-frake with strikes, in which case weirder stuff happens, but this hasn't been completed.
						bracket: attempts === 2 
							? 2 
								: currentPlayerData.strikes.first && frame === 'b10' && bowledScore === 10
								? 0 
							: 1,
						// Reduce pins by the bowled score. TODO: Fix this with the refactor to scores, remove the ternary entirely.
						pinsRemaining: (pins-bowledScore) === NaN ? 10 : (pins-bowledScore)
					}
				}
			}));

			// If we have exactly 1 attempt remaining, or if we bowl a strike, we proceed to the next player and change our frame and bracket.
			// TODO: Change this behavior during final-frame.
			if(attempts === 1 || bowledScore === 'X') {
				setState(state => ({ 
					...state,
					['score'+playerNumber]: { 
						...state['score'+playerNumber],
						fAll: { 
							...state['score'+playerNumber].fAll,
							attempts: 2,
							pinsRemaining: 10,
							bracket: 1,
							frame: frame === 'f10' ? 1 : frame+1,
							currentPlayer: false
						}
					},
					['score'+nextPlayerNumber]: {
						...state['score'+nextPlayerNumber],
						fAll: {
							...state['score'+nextPlayerNumber].fAll,
							currentPlayer: true
						}
					}
				}))
			}

			// At the end of this current monolith function, which we should utilify far more, 
			scoreSettler(playerNumber,frame,bracket,bowledScore);
		};
	};

	// Render the app, with a modal that opens only during game-complete, with a reset condition.
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				{state?.score2?.fAll?.complete && 
					<Modal basic open={true} size='small'>
						<Modal.Content>
							<p>{player1Total > player2Total ? 'Player 1 is the winner!' : 'Player 2 is the winner!'}</p>
						</Modal.Content>
						<Button basic color='green' inverted onClick={() => setState(defaultState)}>New Game</Button>
					</Modal>
				}
				{Object.entries(state).map((player,playerIndex) => 
					<div className="bHPlayer" key={`player${playerIndex+1}Score`}>
						<Grid className="bHGrid" celled>
							<Grid.Row columns={10} className={`bHPlayer${playerIndex+1}`}>
								{Object.entries(state[`score${playerIndex+1}`]).map((frame,frameIndex) =>
									frameIndex === 10 
									? <Grid.Column key={`frame${frameIndex+1}`} width={1}>Total: {playerIndex+1 === 1 ? player1Total : player2Total}</Grid.Column>
									: <Frame
										key={frameIndex+1}
										player={playerIndex+1}
										index={frameIndex+1}
										frameState={state[`score${playerIndex+1}`][`f${frameIndex+1}`]}	
									  />
								)}
							</Grid.Row>
						</Grid> 
						<Button onClick={() => bowl(playerIndex+1)} disabled={!state[`score${playerIndex+1}`].fAll?.currentPlayer || state?.score2.fAll?.complete}>BOWL</Button>
					</div>
				)}
			</header>
		</div>
	);
};

export default App;