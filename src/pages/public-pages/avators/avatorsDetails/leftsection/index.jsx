import { useEffect } from "react";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import FamilyTab from "./Tabs/FamilyTab";
import Travel from "./Tabs/TravelTab";
import ScrapBook from "./Tabs/ScrapBookTab";

const TABS_LIST = {
    FAMILY: {
        key: 'family',
        value: 'Photos'
    },
    TRAVEL: {
        key: 'travel',
        value: 'Travel'
    },
    SCRAPBOOK: {
        key: 'scrapbook',
        value: 'Scrapbook'
    },
}

function LeftSection(props) {
    const { avatarId } = props
    const [activeTabKey, setActiveTabKey] = useState(TABS_LIST.FAMILY.key);

    return (<>
        <div className="col-md-3">
            <div className="outline-box pb-4">
                <div className="px-2">
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={activeTabKey}
                        onSelect={(key) => setActiveTabKey(key)}
                        className="mb-3"
                    >
                        <Tab eventKey={TABS_LIST.FAMILY.key} title={TABS_LIST.FAMILY.value}>
                            <FamilyTab avatarId={avatarId} />
                        </Tab>
                        <Tab eventKey={TABS_LIST.TRAVEL.key} title={TABS_LIST.TRAVEL.value}>
                            <Travel avatarId={avatarId} />
                        </Tab>
                        <Tab eventKey={TABS_LIST.SCRAPBOOK.key} title={TABS_LIST.SCRAPBOOK.value}>
                            <ScrapBook avatarId={avatarId} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    </>);
}
export default LeftSection;