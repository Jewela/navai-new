import React from "react"
import ChatbotForm from "../../../components/HelperChatbot/ChatbotForm"

function HelperChatbotPage() {
    return (<React.Fragment>
        <section className="spacer-md text-center helper-chatpage-container">
            <div className="container d-flex justify-content-center">
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
export default HelperChatbotPage