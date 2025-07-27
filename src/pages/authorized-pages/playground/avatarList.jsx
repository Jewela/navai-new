import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { GENERAL } from "../../../app/config/endpoints";
import { AUTH_ROUTE_SLUGS } from "../../../app/constants";

function AvatarList() {
  const location = useLocation();
  const { userData } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarList, setAvatarList] = useState([]);

  const loadUserAvatars = async () => {
    let payloadData = JSON.stringify({
      take: 50,
      skip: 0,
      filter: {
        logic: "and",
        filters: [
          {
            field: "CreatedById",
            operator: "eq",
            value: userData?.id,
          },
        ],
      },
    });

    try {
      setIsLoading(true);
      const response = await postRequest(GENERAL.GET_AVTAR, payloadData);
      const data = response.data.result.data;
      if (data) {
        setAvatarList(data);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (location.pathname === AUTH_ROUTE_SLUGS.PLAYGROUND) {
      loadUserAvatars();
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading Avatars....</p>
      ) : (
        <div className="avator-listing mt-5">
          {avatarList.map((avatar) => (
            <div
              className="avator__items position-relative"
              key={`avatar-list-${avatar.id}`}
            >
              <div key={avatar.id}>
                <div className="avator__headshot mb-3 position-relative">
                  <Link to={`/playground/${avatar.id}`}>
                    <img
                      src={
                        avatar.profileImage
                          ? avatar.profileImage
                          : "images/avator-4.jpg"
                      }
                      alt={avatar.name}
                      className="rounded-10"
                    />
                  </Link>
                </div>
                <p className="text-white h5 text-center">{avatar.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AvatarList;
