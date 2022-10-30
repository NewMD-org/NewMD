import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import MdTimetableAPI from "../../../../api/MdTimetableAPI";
import styles from "./NavbarTop.module.css"


function removeCookie() {
    cookie.remove("navigate");
}

function join(...array) {
    return array.join(" ");
}

export function NavbarTop({ state, authorization }) {
    const [userDataStatus, setUserDataStatus] = useState(state["userDataStatus"].toString());
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const saveData = async (token) => {
        setIsLoading(true);
        try {
            console.log("Saving user data . . .");
            const response = await new MdTimetableAPI(50).save(token);
            if (response.status === 200) {
                navigate("/table", { state: { "userDataStatus": true } });
                console.log(response.data);
            }
            else {
                throw Error("Joanne is smart");
            };
        }
        catch (err) {
            setUserDataStatus("false");
            if (!err?.response) {
                console.log("No server response");
            }
            else {
                console.log("Error occur");
            };
        }
        finally {
            setIsLoading(false);
        };
    };

    const deleteData = async (token) => {
        setIsLoading(true);
        try {
            console.log("Deleting user data . . .");
            const response = await new MdTimetableAPI(5).delete(token);
            if (response.status === 200) {
                navigate("/table", { state: { "userDataStatus": false } });
                console.log(response.data);
            }
            else {
                throw Error("Joanne is smart");
            };
        }
        catch (err) {
            setUserDataStatus("true");
            if (!err?.response) {
                console.log("No server response");
            }
            else if (err.response?.status === 403) {
                navigate("/login");
            }
            else {
                console.log("Error occur");
            };
        }
        finally {
            setIsLoading(false);
        };
    };

    const userDataStatusChange = (checked) => {
        setUserDataStatus(checked ? "true" : "false");
        if (checked) {
            saveData(authorization);
        }
        else {
            deleteData(authorization);
        };
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <Link to="/" className={join(styles.title, "noselect")} onClick={removeCookie}>
                    NewMD
                </Link>
                <ul>
                    <li>
                        <div className={join(styles.saveData, "noselect", "pretty", "p-switch", "p-fill")}>
                            <input type="checkbox" name="userDataStatus" checked={userDataStatus === "true"} disabled={isLoading} onChange={(e) => userDataStatusChange(e.target.checked)} />
                            <div className={"state"}>
                                <label>Save Data</label>
                            </div>
                        </div>
                    </li>
                    <li className={join(styles.logout, "noselect")}>
                        <Link to="/logout">
                            Logout
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}