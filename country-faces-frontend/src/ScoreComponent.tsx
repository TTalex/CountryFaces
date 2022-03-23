import React, {useState, useEffect} from 'react';

export default function ScoreComponent(props: {hasUserGuessed: boolean, isGuessCorrect: boolean}){
    const [score, setScore] = useState({
        current: 0,
        best: 0
    })
    useEffect(() => {
        if (props.hasUserGuessed) {
            if (props.isGuessCorrect) {
                setScore(prevScore => {
                    return {
                        current: prevScore.current + 1,
                        best: Math.max(prevScore.best, prevScore.current + 1)
                    }
                });
            } else {
                setScore(prevScore => {
                    return {
                        ...prevScore,
                        current: 0
                    }
                });
            }
        }
    }, [props]);
    return (
        <div>
            Score: {score.current} | Meilleur score: {score.best}
        </div>
    )
}
