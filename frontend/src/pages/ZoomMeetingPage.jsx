import React, { useEffect, useRef, useState } from 'react';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { getSignature } from '../services/zoomService';
import '../styles/zoom.css';
import { useParams } from 'react-router-dom';

/*
  ZoomMeetingPage – A fully-customisable wrapper around the Zoom Meeting SDK.
  -------------------------------------------------------------------------
  ‣ Allows you to embed a Zoom meeting inside your React application.
  ‣ Demonstrates how to hide most of the default Zoom chrome and replace it
    with your own controls + a live participant list so you can gather and
    display statistics the way you want.

  NOTE:
  • Replace the *hard-coded* meetingConfig defaults with dynamic data that
    suits your authentication flow before going to production.
  • Required env variables (or other secure storage):
      – REACT_APP_ZOOM_SDK_KEY
*/

const defaultMeetingConfig = {
  apiKey: '1DaNdc0UQT2tGobkosyZRg',
  meetingNumber: '87527371773',
  userName: 'React Host',
  passWord: 'kajW83',
  role: 1, // 1 = host, 0 = attendee
};

// --- Helper components ---------------------------------------------------
const CustomControlBar = ({ client }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);

  if (!client) return null;

  const toggleAudio = async () => {
    try {
      await client[isMuted ? 'unmute' : 'mute']('audio');
      setIsMuted((prev) => !prev);
    } catch (err) {
      console.error('Audio toggle error', err);
    }
  };

  const toggleVideo = async () => {
    try {
      await client[videoOn ? 'stop' : 'start']('video');
      setVideoOn((prev) => !prev);
    } catch (err) {
      console.error('Video toggle error', err);
    }
  };

  return (
    <div className="zoom-custom-controls">
      <button onClick={toggleAudio}>{isMuted ? 'Unmute' : 'Mute'}</button>
      <button onClick={toggleVideo}>{videoOn ? 'Stop Video' : 'Start Video'}</button>
      {/* Add more custom buttons as needed */}
    </div>
  );
};

const ParticipantsSidebar = ({ participants }) => (
  <aside className="zoom-participants">
    <h3>Participants ({participants.length})</h3>
    <ul>
      {participants.map((p) => (
        <li key={p.userId}>{p.displayName}</li>
      ))}
    </ul>
  </aside>
);

// -------------------------------------------------------------------------
const ZoomMeetingPage = () => {
  const { appointmentId } = useParams();
  const [inMeeting, setInMeeting] = useState(false);
  const [participants, setParticipants] = useState([]);
  const zoomDivRef = useRef(null);
  const zmClientRef = useRef(null);

  const startMeeting = async () => {
    try {
      const sig = await getSignature(defaultMeetingConfig.meetingNumber, defaultMeetingConfig.role);
      const client = ZoomMtgEmbedded.createClient();
      zmClientRef.current = client;

      // Minimal Zoom UI – hide header/toolbars, we build our own
      client.init({
        debug: true,
        zoomAppRoot: zoomDivRef.current,
        language: 'en-US',
        customize: {
          video: {
            viewSizes: { default: { width: 800, height: 600 } },
          },
          meetingInfo: [],
          toolbar: false, // Hide the default toolbar
        },
      });

      await client.join({
        sdkKey: defaultMeetingConfig.apiKey,
        signature: sig,
        meetingNumber: defaultMeetingConfig.meetingNumber,
        password: defaultMeetingConfig.passWord,
        userName: defaultMeetingConfig.userName,
      });

      // Subscribe to participant events for statistics
      client.on('user-added', (payload) => {
        setParticipants((prev) => [...prev, payload]);
      });
      client.on('user-removed', (payload) => {
        setParticipants((prev) => prev.filter((p) => p.userId !== payload.userId));
      });
      client.on('user-updated', (payload) => {
        setParticipants((prev) => prev.map((p) => (p.userId === payload.userId ? payload : p)));
      });

      setInMeeting(true);
    } catch (err) {
      console.error('Failed to start Zoom meeting', err);
    }
  };

  return (
    <div className="zoom-wrapper">
      {!inMeeting && (
        <div className="zoom-prejoin">
          <button className="btn btn-primary" onClick={startMeeting}>
            Join Zoom Meeting
          </button>
        </div>
      )}

      <div ref={zoomDivRef} id="zoom-embed" style={{ width: '100%', height: '600px' }} />

      {inMeeting && <CustomControlBar client={zmClientRef.current} />}
      {inMeeting && <ParticipantsSidebar participants={participants} />}
    </div>
  );
};

export default ZoomMeetingPage; 