export const RecordedAudioList = ({ audios, onDelete }) => {
    return (
        <div>
            {audios.map(audio => (
                <div key={audio.id}>
                    <button onClick={() => new Audio(audio.url).play()}>Play</button>
                    <button onClick={() => onDelete(audio.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};
