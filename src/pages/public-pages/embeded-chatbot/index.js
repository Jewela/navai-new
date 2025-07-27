import React from "react"
import ChatbotForm from "../../../components/EmbededChatbot/ChatbotForm"

function EmbededChatbotPage() {
    return (<React.Fragment>
        <section className="text-center embeded-chatpage-container">
            <div className="">
                <div className="helperpage-chatbot-box ">
                    <div className="chatbot__head">
                        <img src="/images/avatar-5.jpg" className="agent" />
                        <h6>Hi there</h6>
                    </div>
                    <ChatbotForm />
                </div>
            </div>
        </section>
    </React.Fragment>)
}
export default EmbededChatbotPage