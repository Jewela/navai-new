import React, { useEffect, useState } from "react";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import SubjectFilter from './FilterTabs/SubjectFilter'
import DateFilter from "./FilterTabs/DateFilter";
import { PHOTO_ALBUM_ACTIONS as ACTIONS } from "../../../../../redux/authenticate/actions";
import { useDispatch, useSelector } from "react-redux";

const TABS_LIST = {
    SUBJECT: {
        key: 'subject',
        value: 'Subject'
    },
    DATE: {
        key: 'date',
        value: 'Date'
    },
}

function LeftSection(props) {

    const { avatorId, mediaCategory } = { ...defaultProps, ...props }
    const dispatch = useDispatch();
    const [photoAlbumfilterKey, setPhotoAlbumFIlterKey] = useState(TABS_LIST.SUBJECT.key);
    const { selectedAvatar } = useSelector((state) => state.photo_album_reducer);

    // const handleChange = (event, setStateValue) => {
    //     const { value } = event.target;
    //     setTotalRecords(0);
    //     setSetAvtarMediaList([]);
    //     setSkipRecord(0)
    //     setStateValue(value);
    // }

    const handlFiltertabChange = (key) => {
        setPhotoAlbumFIlterKey(key);
        dispatch({
            type: ACTIONS.HANDLE_FILTER_TYPE_CHANGE,
            payload: { filterKey: key }
        });
    }

    if (selectedAvatar.status) return;

    return (<>

        <div className="col-md-3">
            <div className="outline-box pb-4">
                {/* {JSON.stringify({ photoAlbumfilterKey }, null, 2)} */}
                <div className="p-4">
                    <span className="h5 mb-3 d-block">Filter By</span>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={photoAlbumfilterKey}
                        onSelect={(key) => handlFiltertabChange(key)}
                        className="mb-4 mt-0 justify-content-around"
                    >
                        <Tab eventKey={TABS_LIST.SUBJECT.key} title={TABS_LIST.SUBJECT.value}>
                            <SubjectFilter
                                avatorId={avatorId}
                                mediaCategory={mediaCategory}
                                photoAlbumfilterKey={photoAlbumfilterKey}
                                TABS_LIST={TABS_LIST}
                            />
                        </Tab>
                        <Tab eventKey={TABS_LIST.DATE.key} title={TABS_LIST.DATE.value}>
                            <DateFilter
                                photoAlbumfilterKey={photoAlbumfilterKey}
                                avatorId={avatorId}
                                mediaCategory={mediaCategory}
                                TABS_LIST={TABS_LIST}
                            />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>

        {/* <div className="col-md-3">
            <div className="outline-box pb-4 media-sticky">
                <div className="px-2">
                    <div className="row  px-2 py-3">
                        <div className="col-md-12">
                            <p>By subject:</p>
                        </div>
                        <div className="col-md-12">
                            {isSubjectFilterLoading
                                ? <div className=''>
                                    <Spinner className="" as="span" animation="border" size="md" role="status" aria-hidden="true" />
                                </div>
                                : <select className="form-control" onChange={(event) => handleChange(event, MapState.subject)}>
                                    <option value={null}></option>
                                    {subjectFilter.length > 0 && subjectFilter.map((subjectItem, index) => {
                                        return <React.Fragment key={`subject-filter-key-${index}`}>
                                            <option value={subjectItem.subjectId}>{subjectItem.name}</option>
                                        </React.Fragment>
                                    })}
                                </select>
                            }
                        </div>
                    </div>
                    <div className="row  px-2 py-3">
                        <div className="col-md-12">
                            <p>By date:</p>
                        </div>
                        <div className="col-md-12">
                            {isDateFilterLoading
                                ? <div className=''>
                                    <Spinner className="" as="span" animation="border" size="md" role="status" aria-hidden="true" />
                                </div>
                                : <select className="form-control" onChange={(event) => handleChange(event, MapState.year)} >
                                    <option value={null}></option>
                                    {yearFilter.length > 0 && yearFilter.map((year, index) => {
                                        return <React.Fragment key={`year-filter-key-${index}`}>
                                            <option value={year}>{year}</option>
                                        </React.Fragment>
                                    })}
                                </select>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div> */}
    </>);
}
export default LeftSection;
const defaultProps = {
    avatorId: 0,
    mediaCategory: -1,
}