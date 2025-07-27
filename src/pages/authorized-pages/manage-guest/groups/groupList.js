import { Spinner } from "react-bootstrap";
import { AUTH_ROUTE_SLUGS } from "../../../../app/constants";
import { Link } from "react-router-dom";

function GroupList(props) {
    const { groupList, isLoading } = props;


    if (isLoading) {
        return <>
            <div className='mt-5 pre-loading'>
                <Spinner className="mb-2" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            </div>
        </>
    }

    return (<>
        <div className="col-md-12 mx-auto">
            <div className="box-wrap">
                <div className="box-header border-0 profile-option-title flex-column">
                    <div className="d-flex justify-content-between">
                        <h2 className="h3 mb-0 mt-2"><i className="ri-group-2-line"></i> Guest Groups</h2>
                        <Link className="btn btn-sm btn-primary" to={AUTH_ROUTE_SLUGS.ADD_NEW_GUEST_GROUP}>
                            <i className="ri-add-line"></i>Add Guest Group
                        </Link>
                    </div>
                    <div className="profile__options mt-4">
                        {groupList.length > 0
                            ? groupList.map((group, index) => {
                                return <div className="h3 rounded-10 p-4" key={`key-emp-id-${group.id}`} id={`emp-id-${group.id}`}>
                                    <Link to={`${AUTH_ROUTE_SLUGS.MANAGE_GUEST_GROUP}/${group.id}`}>
                                        <div className="h4">{group?.name}</div>
                                    </Link>
                                </div>
                            })
                            : <span className="d-flex justify-content-center text-danger">Groups not found.</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default GroupList;