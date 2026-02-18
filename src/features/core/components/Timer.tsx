import "./Timer.scss";

type Props = {
    timeLeft: number;
}

export default function Timer({ timeLeft }: Props) {
    return (
        <div className="timer-container">
            {timeLeft}
        </div>
    );
}