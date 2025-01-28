import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import Leaderboard from "./LeaderboardComp";

import "./public_css/bulma.min.css";
import "./public_css/bulma-carousel.min.css";
import "./public_css/bulma-slider.min.css"
import "./index.css";

import Acc from "./mocks/acc_new.json";

const LeaderboardTabs = () => {
  // State to track the currently selected tab
  const [activeTab, setActiveTab] = useState('tab1');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to render the leaderboard based on the selected tab
  const renderLeaderboard = () => {
    switch (activeTab) {
      case 'tab1':
        return <Leaderboard theme={{ base: "light" }} args={Acc} />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="tabs-container">
      <ul className={`tabs ${isMobile ? 'mobile' : ''}`}>
        {/* Add your tabs here if needed */}
      </ul>
      <div className="tab-content">
        {renderLeaderboard()}
      </div>
    </div>
  );
};

const LeaderboardPage = () => {
  return (
    <React.StrictMode>
      {/* Hero Section */}
      <section className="hero is-medium">
        <div className="hero-body">
          <div className="container">
            <h1 className="title publication-title">
              Leveraging Online Olympiad-Level Math Problems for LLMS Training and Contamination-Resistant Evaluation
            </h1>
            <div className="buttons is-centered">
              <a href="paper.pdf" className="button is-primary is-rounded" target="_blank" rel="noopener noreferrer">
                <span className="icon">
                  <i className="fas fa-file-pdf"></i>
                </span>
                <span>Paper</span>
              </a>
              <a href="https://github.com/LiveMathBench/LiveMathBench.github.io" className="button is-info is-rounded" target="_blank" rel="noopener noreferrer">
                <span className="icon">
                  <i className="fab fa-github"></i>
                </span>
                <span>Code</span>
              </a>
              <a href="index.html" className="button is-warning is-rounded">
                <span className="icon">
                  <i className="fas fa-home"></i>
                </span>
                <span>Home</span>
              </a>
              <a href="./data/LiveAoPSBench-2024.jsonl" className="button is-success is-rounded">
                <span className="icon">
                  <i className="fa fa-database"></i>
                </span>
                <span>LiveAoPSBench Data</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="section" id="leaderboard">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-full">
              <h1 className="title is-3 leaderboard-title has-text-centered">LiveAoPSBench</h1>
              <div className="content">
                <LeaderboardTabs />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            &copy; 2024 OlympicMath Dataset Project. All rights reserved.
          </p>
          <p>Web page style inspired by https://livecodebench.github.io/leaderboard.html</p>
          {/* <p>
            <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
          </p> */}
        </div>
      </footer>
    </React.StrictMode>
  );
};

ReactDOM.render(
  <LeaderboardPage />,
  document.getElementById("root")
);
