import React, { useEffect, useState } from "react";
import API from "../api";

const Dashboard = () => {
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        try {
            const res = await API.get("/events");
            setEvents(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div>
            <h2>Events Dashboard</h2>

            {events.map((event) => (
                <div key={event._id}>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <small>{event.date}</small>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;