import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDI-fY5eFakDLeUB50t87hfcudTue42T7c",
  authDomain: "thecareercompany-3c299.firebaseapp.com",
  projectId: "thecareercompany-3c299",
  storageBucket: "thecareercompany-3c299.appspot.com",
  messagingSenderId: "217217520914",
  appId: "1:217217520914:web:184110c3b648dd44470fcb",
  measurementId: "G-F2RXX3DCZ3"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

function MentorDashboard() {
  const [sessionRequests, setSessionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(firestore, 'sessionRequests'),
      where('status', '==', 'pending'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSessionRequests(requests);
        setLoading(false);
      },
      error => {
        setError(`Failed to fetch session requests: ${error.message}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await updateDoc(doc(firestore, 'sessionRequests', requestId), { status: 'accepted' });
    } catch (error) {
      setError(`Failed to accept session request: ${error.message}`);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await updateDoc(doc(firestore, 'sessionRequests', requestId), { status: 'rejected' });
    } catch (error) {
      setError(`Failed to reject session request: ${error.message}`);
    }
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Mentor Dashboard</h1>
      <h2 className="my-3">Pending Session Requests</h2>

      {loading && <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {sessionRequests.length === 0 && !loading && (
          <Col>
            <Alert variant="info">No pending session requests.</Alert>
          </Col>
        )}
        {sessionRequests.map(request => (
          <Col sm={12} md={6} lg={4} key={request.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Topic: {request.topic}</Card.Title>
                <Card.Text>
                  <strong>Date:</strong> {request.preferredDate}<br />
                  <strong>Time:</strong> {request.preferredTime}
                </Card.Text>
                <Button variant="success" onClick={() => handleAccept(request.id)} className="mr-2 m-3">Accept</Button>
                <Button variant="danger" onClick={() => handleReject(request.id)}>Reject</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MentorDashboard;