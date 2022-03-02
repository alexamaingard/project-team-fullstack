import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRISMA_ERROR } from '../../../server/config';

import { FETCH_METHOD, LOCAL_STORAGE, INT_LINK, USER_URL } from '../../config';

const CreateProfile = (props) => {
    const { user, setUser } = props;

    console.log("id", typeof parseInt(localStorage.getItem(LOCAL_STORAGE.USER_ID), 10));

    const initialForm = { 
        location: "", 
        profilePicture: "", 
        userId: parseInt(localStorage.getItem(LOCAL_STORAGE.USER_ID), 10)
    };

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const token = localStorage.getItem(LOCAL_STORAGE.TOKEN)

    useEffect(() => {
        setError(null);
    }, [form]);

    console.log('state', {
        user, 
        form,
        error
    });

    const SubmitForm = async () => {
        const fetchedProfile = await postForm();

        if (fetchedProfile.error) {
            setError(fetchedProfile.error);
            console.log('error', error)

            return;
        }

        setUser({...user, profile: fetchedProfile.data});

        navigate(INT_LINK.HOME, { replace: true });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        await SubmitForm();
    };

    const postForm = async () => {
        try {
            const response = await fetch(USER_URL.PROFILE, {
                method: FETCH_METHOD.POST,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(form),
            });

            return await response.json();
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = async (event) => {
        event.preventDefault();

        setForm(initialForm);

        await SubmitForm();
    };

    return (
        <div className="signup">
            <form className="signup-form">
                <h1>Create Profile</h1>
                <div className="input-groups">
                    <label htmlFor="profilePicture">Profile Picture:</label>
                    <input
                        type="text"
                        id="profilePicture"
                        className="input"
                        name="profilePicture"
                        value={form.profilePicture}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-groups">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        className="input"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                    />
                </div>
                {error &&
                    <>
                        <p className="error">{error}</p>
                        {error === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION.CLIENT_MESSAGE_PROFILE ? navigate(INT_LINK.HOME) : null}
                        <br></br>
                    </>
                }
                <button
                    type="submit"
                    className="register-btn"
                    onClick={handleSubmit}
                >
                    Create Profile
                </button>
                <button onClick={handleCancel}>
                    Skip
                </button>
            </form>
        </div>
    );
};

export default CreateProfile;