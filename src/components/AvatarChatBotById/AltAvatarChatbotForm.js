import { useState } from "react";
import HelperChatbot from "../HelperChatbot";

function AltAvatarChatbotForm() {

    const [initiated, setInitiated] = useState(true);
    const [selectedBox, setSelectedBox] = useState("");
    const [skipTake, setSkipTake] = useState({ take: 0, skip: -1 });

    if (initiated) {
        return (<>
            <HelperChatbot
                setSkipTake={setSkipTake}
                skipTake={skipTake}
                selectedBox={selectedBox}
                setSelectedBox={setSelectedBox}
            />
        </>);
    }
}
export default AltAvatarChatbotForm;