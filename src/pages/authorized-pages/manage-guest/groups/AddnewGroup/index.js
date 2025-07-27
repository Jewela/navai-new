import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import AvatarMenu from "../../../avtars/AvatarMenu";
import { AUTH_ROUTE_SLUGS, RESPONSE_CODE } from "../../../../../app/constants";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useState } from "react";
import { postRequest } from "../../../../../app/httpClient/axiosClient";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";
import { AVTAR } from "../../../../../app/config/endpoints";

const validationSchema = yup.object().shape({
    groupName: yup.string()
        .required("This Email field is required.")
});

function AddnewGroup() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "submit",
        resolver: yupResolver(validationSchema),
    });

    const handleBacknavigation = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(AUTH_ROUTE_SLUGS.AVTAR.LIST);
        }
    }

    const onSubmit = async (formData) => {
        try {
            const { groupName } = formData;
            setLoading(true);
            const payload = { name: groupName }
            const response = await postRequest(AVTAR.CREATE_NEW_GROUP, payload);

            const { status, data: { data, httpStatusCode } } = response;
            console.log({ data })
            if (
                // httpStatusCode === RESPONSE_CODE[200] &&
                status === RESPONSE_CODE[200]
            ) {
                toast.success("new Group addedd successfully!")
                setLoading(false);
                navigate(AUTH_ROUTE_SLUGS.MANAGE_GUEST);
            }

        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.warn({ error, errorMessage });
            toast.error(errorMessage)
            setLoading(false);
        }
    }

    return (<>
        <section className="page-heading light-bg py-5">
            <div className="container">
                <div className="row position-relative">
                    <div className="col-md-12 text-center position-relative">
                        <h1 className="mb-0 h2 fw-bold">
                            Manage Guest
                        </h1>
                    </div>
                    <AvatarMenu />
                </div>
            </div>
        </section>

        <section className="spacer-md avator py-4">
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div>
                        <span role="button" onClick={handleBacknavigation}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Back
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mx-auto">
                        <svg
                            width="100%"
                            height="1050"
                            viewBox="0 0 1500 1500"
                            className="filter-svg"
                        >
                            <circle cx="700" cy="700" fill="#53107B" r="650"></circle>
                        </svg>
                    </div>
                    <div className="col-md-12 mt-5 mx-auto">
                        <div className="box-wrap">
                            <div className="box-header border-0 profile-option-title flex-column">
                                <div className="d-flex justify-content-between">
                                    <div className="box-body col-md-8">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="d-flex justify-content-between">
                                                <div className="flex-fill">
                                                    <input
                                                        {...register("groupName")}
                                                        className="form-control chatbot_input"
                                                        type="text"
                                                        placeholder="Enter Group name"
                                                        autoComplete="off"
                                                        readOnly={isLoading}
                                                    />
                                                    {errors.groupName && (
                                                        <p className="text-error">{errors.groupName.message}</p>
                                                    )}
                                                </div>
                                                <div className="ms-4 flex-fill">
                                                    <button disabled={isLoading} className="btn btn-xs btn-primary" type="submit" name="add">
                                                        Submit {isLoading && <span className="spinner-border spinner-border-sm mx-2" role="status" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}

export default AddnewGroup;