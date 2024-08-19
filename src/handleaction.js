// src/components/MentorDashboard.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import fetchsession from "./fetchsession";
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

    return () => unsubscribe();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await firestore.collection('sessionRequests').doc(requestId).update({
        status: 'accepted'
      });
    } catch (error) {
      console.error('Failed to accept session request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await firestore.collection('sessionRequests').doc(requestId).update({
        status: 'rejected'
      });
    } catch (error) {
      console.error('Failed to reject session request:', error);
    }
  };

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

export default MentorDashboard;
