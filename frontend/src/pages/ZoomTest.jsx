// ZoomMeetingComponentView.js
import React, { useEffect, useRef } from 'react';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

import { getSignature } from '../services/zoomService';
import '../styles/zoom.css'; // CSS tùy chỉnh của bạn nếu có


const meetingConfig = {
  apiKey: 'q48VIOcOS7Wb6xCsjQI5bg',
  meetingNumber: '87527371773',
  userName: 'React User 1',
  passWord: 'kajW83',
  role: 1,
};

const ZoomMeeting = () => {
  const zoomDivRef = useRef(null);
  const zmClient = useRef(null);
  const [showMeeting, setShowMeeting] = React.useState(false);

  const startMeeting = async () => {
    try {
      const signature = await getSignature(meetingConfig.meetingNumber, meetingConfig.role);
      zmClient.current = ZoomMtgEmbedded.createClient();

      const meetingSDKElement = zoomDivRef.current;
      zmClient.current.init({
        debug: true,
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
        customize: {
          video: {
            popper: {
              disableDraggable: true,
            },
            isResizable: false,
            viewSizes: {
              default: {
                width: 800,
                height: 600,
              },
            },
          },
        },
      });

      await zmClient.current.join({
        sdkKey: meetingConfig.apiKey,
        signature: signature,
        meetingNumber: meetingConfig.meetingNumber,
        password: meetingConfig.passWord,
        userName: meetingConfig.userName,
      });
      setShowMeeting(true);

    } catch (error) {
      console.error('Error joining Zoom meeting:', error);
    }
  };

  return (
    <div className="telemedicine-container">
      {!showMeeting && (
        <button onClick={startMeeting} className="btn btn-primary">
          Join Zoom Meeting
        </button>
      )}
      <div
        id="zoom-meeting-embed"
        ref={zoomDivRef}
        style={{ width: '100%', height: '600px', marginTop: '20px' }}
      ></div>
    </div>
  );
};

export default ZoomMeeting;
