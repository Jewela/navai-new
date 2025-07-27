import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { postRequest, putRequest } from "../../../../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../../../../app/config/endpoints";
import { RESPONSE_CODE } from "../../../../../../app/constants";
import toast from "react-hot-toast";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getErrorMessage } from "../../../../../../utils/helpers/apiErrorResponse";

const PAGINATIOIN = {
    TAKE: 50,
    SKIP: 0,
    NO_OF_RECORDS: 9,
    TOTAL_RECORDS: 0,
};

const groupValidationSchema = yup.object().shape({
    formType: yup.string().required('Form type is required.'), // formType must be validated

    group: yup.string().test('group-validation', 'Group is required.', function (value) {
        const { formType } = this.parent;
        if (formType === 'avatar') {
            return !!value;
        }
        return true;
    }),
    selectedGroup: yup.string(),
    group_name: yup.string().test('group-name-validation', 'Group name is required.', function (value) {

        const { formType } = this.parent;
        if (formType === 'group') {
            return !!value;
        }
        return true;
    }),

});

const FORM_TYPE = {
    AVATAR: 'avatar',
    GROUP: 'group'
}

function AgentGroups(props) {
    const { show, onHide = undefined, fncallback = undefined, avatar = {}, mappedGroups = [], setMappedGroup } = props;
    if (!show) return null;

    const [isLoading, setLoading] = useState(true);
    const [formSubmiIsLoading, setFormSubmiIsLoading] = useState(false);
    const [groupList, setGroupList] = useState([]);
    const [loadMore, setLoadMore] = useState(true);

    const [takeRecord, setTakeRecord] = useState(PAGINATIOIN.TAKE);
    const [skipRecord, setSkipRecord] = useState(PAGINATIOIN.SKIP);
    const [totalRecords, setTotalRecords] = useState(PAGINATIOIN.TOTAL_RECORDS);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [selectedGroupIds, SetSelectedGroupIds] = useState([]);

    const [newGroupStatus, setNewGroupStatus] = useState(false);
    const [currentFormType, setCurrentFormType] = useState(FORM_TYPE.AVATAR);

    const { register, handleSubmit, formState: { errors }, reset, clearErrors, setValue } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(groupValidationSchema),
        defaultValues: { formType: 'avatar' },
    });

    const handleNewGroupStatus = (status = false, formType = FORM_TYPE.AVATAR) => {
        setNewGroupStatus(status);
        setCurrentFormType(formType);
        setValue('formType', formType);
        // reset();
    }

    const handleSave = async (formData) => {
        setLoading(true);
        const { formType, group = 0, group_name = "" } = formData;
        const selectedGroup = groupList.find(__group => __group.id.toString() === group);
        console.log(selectedGroup);
        // return;
        let payloadData, ENDPOINT;
        try {
            if (formType === FORM_TYPE.AVATAR) {
                payloadData = {
                    "avatarId": avatar?.Avatarid,
                    "groupId": group,
                    // "invitationIds": [
                    //     0
                    // ],
                    "mapCompleteGroup": true
                };
                ENDPOINT = AVTAR.GUEST_MAP
            } else if (formType === FORM_TYPE.GROUP) {
                payloadData = { name: group_name };
                ENDPOINT = AVTAR.CREATE_NEW_GROUP
            } else {
                toast.error("Unable get selected values. please try aging.");
                setLoading(false);
                return false;
            }

            const response = await postRequest(ENDPOINT, payloadData);

            const { status, data: { result, httpStatusCode } } = response;
            if (httpStatusCode === RESPONSE_CODE[200] && status === RESPONSE_CODE[200]) {
                // const successMessage = updateMode ? '' : 'Photo album created successfully.'
                if (formType === FORM_TYPE.AVATAR) {
                    setMappedGroup([...mappedGroups, {
                        groupId: parseInt(group),
                        name: selectedGroup?.name
                    }]);
                    toast.success('Avatar added to the group successfully.');
                    onHide();
                } else if (formType === FORM_TYPE.GROUP) {
                    toast.success('New group created successfully.');
                    getGroup();
                    handleNewGroupStatus();
                } else {
                    toast.error("Unable get selected values. please try aging.")
                }
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error(`Photo album Couldn't be updated. Please try again.`)
            setLoading(false);
        }
    }

    const getGroup = async () => {
        try {
            setLoadMore(true);
            const payload = {
                "skip": skipRecord,
                "take": takeRecord,
            }
            const response = await postRequest(AVTAR.GET_GROUPS, payload);
            const { status, data: { data: { count, groupDetails }, httpStatusCode } } = response;
            console.log({ response, count, groupDetails });
            console.warn({ httpStatusCode, status });

            if (httpStatusCode === RESPONSE_CODE[200] && status === RESPONSE_CODE[200]) {
                if (groupDetails.length) {
                    // const _groups = groupDetails.filter((group) => )
                    const filteredGroups = groupDetails.filter(group =>
                        !mappedGroups.some(mapped => mapped.groupId === group.id)
                    );
                    console.log({ groupDetails, mappedGroups, filteredGroups });
                    setGroupList(filteredGroups);
                    console.log(filteredGroups)
                } else {
                    setIsLimitReached(true);
                }

                setLoading(false);
                setLoadMore(false);
                setTotalRecords(count);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.warn({ error, errorMessage });
            toast.error(errorMessage)
            setLoading(false);
            setLoadMore(false);
        }
    }

    const handleSelect = (id) => {
        if (selectedGroupIds.includes(id)) {
            SetSelectedGroupIds(selectedGroupIds.filter(groupId => groupId !== id));
        } else {
            SetSelectedGroupIds([...selectedGroupIds, id]);
        }
    };

    const IfSelectedGroupId = (id) => {
        return selectedGroupIds.includes(id);
    }

    const loadMoreGroups = () => {
        setSkipRecord((prev) => prev + PAGINATIOIN.NO_OF_RECORDS);
    };

    useEffect(() => {
        getGroup();
        if (groupList.length === 0) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant",
            });
        }
    }, [skipRecord])

    return (<>
        <Modal
            {...props}
            size="lg"
            className="agent-group-modal"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title><i className="ri-group-line me-1"></i>Groups</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-0">
                {isLoading
                    ? <div className="pt-3 text-center">
                        <Spinner
                            as="span"
                            size="md"
                            role="status"
                            aria-hidden="true"
                        />
                        <p>Please wait...</p>
                    </div>
                    : (<>
                        <form onSubmit={handleSubmit(handleSave)}>
                            <input type="hidden" {...register('formType')} value={currentFormType} />
                            {newGroupStatus
                                ? <>
                                    <div className="row">
                                        <div className="mb-3">
                                            <label>Groups Name</label>
                                            <input
                                                className="form-control"
                                                {...register('group_name')}
                                                placeholder="Group name"
                                            />
                                            {errors.group_name && <p className='text-error'>{errors.group_name.message}</p>}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end my-3">
                                        <button
                                            type="button"
                                            disabled={formSubmiIsLoading}
                                            className="btn padding-2 btn-danger btn-sm me-2"
                                            onClick={() => handleNewGroupStatus()}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn padding-2 primary-btn btn-sm"
                                            disabled={formSubmiIsLoading}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </>
                                : <>
                                    <div className="row">
                                        <div className="mb-3">
                                            <label>Groups</label>
                                            <select
                                                disabled={formSubmiIsLoading}
                                                {...register('group')}
                                                className="form-control"
                                            >
                                                <option value={null}></option>
                                                {groupList.length > 0 && groupList.map((group, index) => {
                                                    return <React.Fragment key={`subitem-key-${index}`}>
                                                        <option value={group.id}>{group?.name}</option>
                                                    </React.Fragment>
                                                })}
                                            </select>
                                            {errors.group && <p className='text-error'>{errors.group.message}</p>}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end my-3">
                                        <button
                                            type="submit"
                                            disabled={formSubmiIsLoading}
                                            className="btn padding-2 primary-btn btn-sm me-2"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn padding-2 primary-btn btn-sm"
                                            disabled={formSubmiIsLoading}
                                            onClick={() => handleNewGroupStatus(true, FORM_TYPE.GROUP)}
                                        >
                                            <i className="ri-add-line me-2 text-white"></i> Create Group
                                        </button>
                                    </div>
                                </>
                            }
                        </form>

                    </>)

                }
            </Modal.Body>
        </Modal>
    </>)
}
export default AgentGroups;