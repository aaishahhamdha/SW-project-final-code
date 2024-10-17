import React ,{useRef,useEffect} from 'react';
import { Link } from 'react-router-dom';
import './ProfileCardPop.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartBar, faTachometerAlt, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { handleLogout } from "../../Logout/Logout";

const ProfileCard = ({ trigger, setTrigger}) => {
  const profileCardRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
        setTrigger(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setTrigger]);

  return trigger ? (
    <div className="profile-card-con">
      <div className="profile-card-pop" ref={profileCardRef}>
        <div className="profile-opts">
          <div className="profile-item2">
            <Link to="/profile">
              <button className="profile-button-new">
                <FontAwesomeIcon icon={faUser} /> &nbsp;View Profile
              </button>
            </Link>
          </div>
          <div className="profile-item2">
            <Link to="/collaborations">
              <button className="collaborations-button-new">
                <FontAwesomeIcon icon={faUsers} /> &nbsp;Collaborations
              </button>
            </Link>
          </div>
        
        
          <div className="profile-item2">
            <button className="logout-button-new" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> &nbsp;Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ProfileCard;