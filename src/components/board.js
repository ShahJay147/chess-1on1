import React, { Component } from "react";
import PropTypes from "prop-types";
import Chess from "chess.js";
import ReactResizeDetector from "react-resize-detector";

import Chessboard from "chessboardjsx";

class OneonOne extends Component {
    static propTypes = { children: PropTypes.func };

    state = {
        fen: "start",
        dropSquareStyle: {},
        squareStyles: {},
        pieceSquare: "",
        square: "",
        history: [],
        result: ""
    };

    componentDidMount() {
        this.game = new Chess();
        this.result();
    }

    result = () => {
        var curr_game = this.game;
        if(curr_game.game_over()){
            var status = "pending";
            if(curr_game.in_checkmate())
                status = "Check Mate";
            else if(curr_game.in_draw())
                status = "Draw";
            this.setState({result: status});
        }
    };

    removeHighlightSquare = () => {
        this.setState(({ pieceSquare, history }) => ({
            squareStyles: squareStyling({ pieceSquare, history })
        }));
    };

    highlightSquare = (sourceSquare, squaresToHighlight) => {
        const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
            (a, c) => {
                return {
                    ...a,
                    ...{
                        [c]: {
                            background:
                                "radial-gradient(circle, yellow 36%, transparent 40%)",
                            borderRadius: "50%"
                        }
                    },
                    ...squareStyling({
                        history: this.state.history,
                        pieceSquare: this.state.pieceSquare
                    })
                };
            },
            {}
        );

        this.setState(({ squareStyles }) => ({
            squareStyles: { ...squareStyles, ...highlightStyles }
        }));
    };

    onDrop = ({ sourceSquare, targetSquare }) => {
        let move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        if (move === null) return;
        this.result();

        this.setState(({ history, pieceSquare }) => ({
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            squareStyles: squareStyling({ pieceSquare, history })
        }));
    };

    onMouseOverSquare = square => {
        let moves = this.game.moves({
            square: square,
            verbose: true
        });

        if (moves.length === 0) return;

        let squaresToHighlight = [];
        for (var i = 0; i < moves.length; i++) {
            squaresToHighlight.push(moves[i].to);
        }

        this.highlightSquare(square, squaresToHighlight);
    };

    onMouseOutSquare = square => this.removeHighlightSquare(square);

    onSquareClick = square => {
        this.setState(({ history }) => ({
            squareStyles: squareStyling({ pieceSquare: square, history }),
            pieceSquare: square
        }));

        let move = this.game.move({
            from: this.state.pieceSquare,
            to: square,
            promotion: "q"
        });

        if (move === null) return;

        this.result();

        this.setState({
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            pieceSquare: ""
        });
    };

    render() {
        const { fen, dropSquareStyle, squareStyles, result } = this.state;

        return this.props.children({
            squareStyles,
            position: fen,
            onMouseOverSquare: this.onMouseOverSquare,
            onMouseOutSquare: this.onMouseOutSquare,
            onDrop: this.onDrop,
            dropSquareStyle,
            onSquareClick: this.onSquareClick,
            result: result
        });
    }
}

export default function Board() {
    return (
        <ReactResizeDetector handleWidth>
            {({ width}) => {
                const size = Math.min(width, 784) - 64;

                return (
                    <div>
                        <OneonOne>
                            {({
                                  position,
                                  onDrop,
                                  onMouseOverSquare,
                                  onMouseOutSquare,
                                  squareStyles,
                                  dropSquareStyle,
                                  onSquareClick,
                                  result
                              }) => (
                                <div>
                                    <div style={{fontSize: '18px', textAlign: 'center'}}>{result}</div>
                                    <div>
                                        <Chessboard
                                            id="OneOnOne"
                                            width={size}
                                            position={position}
                                            onDrop={onDrop}
                                            onMouseOverSquare={onMouseOverSquare}
                                            onMouseOutSquare={onMouseOutSquare}
                                            boardStyle={{
                                                borderRadius: "5px",
                                                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
                                                margin: "24px auto"
                                            }}
                                            squareStyles={squareStyles}
                                            dropSquareStyle={dropSquareStyle}
                                            onSquareClick={onSquareClick}
                                        />
                                    </div>
                                </div>
                            )}
                        </OneonOne>
                    </div>
                );
            }}
    </ReactResizeDetector>
);
}

const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
        [pieceSquare]: { backgroundColor: "yellow" },
        ...(history.length && {
            [sourceSquare]: {
                backgroundColor: "yellow"
            }
        }),
        ...(history.length && {
            [targetSquare]: {
                backgroundColor: "yellow"
            }
        })
    };
};
