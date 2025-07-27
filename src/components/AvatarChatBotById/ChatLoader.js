function ChatLoader({ agentImage, agentName }) {
    return (
        <div className="mx-2 chatlist-header chatbot__header">
            <img src={agentImage} style={{ width: '2.5em', height: '2.5em' }} />
            <div className="chatlist-item">
                <div className="">
                    <strong>{agentName}</strong>:
                </div>
                <div className="card-body">
                    <p className="card-text placeholder-glow">
                        <span className="placeholder col-7" />
                        <span className="placeholder col-4 ms-2" />
                        <span className="placeholder col-4" />
                        <span className="placeholder col-7 ms-2" />
                        <span className="placeholder col-3" />
                        <span className="placeholder col-3 ms-2" />
                        <span className="placeholder col-5 ms-2" />
                    </p>
                </div>
            </div>
        </div>
    )
}
export default ChatLoader;