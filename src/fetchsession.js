// src/components/MentorDashboard.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import sessionRequests from "./MentorDashboard";

function MentorDashboard() {
  const [sessionRequests, setSessionRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('sessionRequests')
      .where('status', '==', 'pending')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSessionRequests(requests);
      });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Mentor Dashboard</h1>
      <h2>Pending Session Requests</h2>
      <ul>
        {sessionRequests.map(request => (
          <li key={request.id}>
            <p>Topic: {request.topic}</p>
            <p>Date: {request.preferredDate}</p>
            <p>Time: {request.preferredTime}</p>
            <button onClick={() => handleAccept(request.id)}>Accept</button>
            <button onClick={() => handleReject(request.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
