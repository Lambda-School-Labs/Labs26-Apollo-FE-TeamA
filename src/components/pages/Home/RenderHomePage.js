import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import { Link, Route } from "react-router-dom";
import Requests from "../../home_components/Requests";
import { RequestsContext } from "../../../state/contexts/RequestsContext";
import TopicsList from "../../home_components/TopicsList";
import NewTopicContainer from "../NewTopic/NewTopicContainer";
import MainTopic from "../MainTopic/MainTopicContainer";
import { TopicListContext } from "../../../state/contexts/TopicListContext";
import Responses from "../../home_components/Responses";
import { ResponsesContext } from "../../../state/contexts/ResponsesContext";
import ThreadsList from "../../home_components/ThreadsList";
import { ThreadsContext } from "../../../state/contexts/ThreadsContext";
import { getAllResponses, getAllTopics, getAllThreads } from "../../../api";

function RenderHomePage(props) {
  // state handlers
  const { userInfo, authService } = props;
  const [topics, setTopics] = useState([]);
  const [topicID, setTopicID] = useState(0);
  const [requestList, setRequests] = useState([]);
  const [responseList, setResponses] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    getAllTopics()
      .then(res => {
        let userTopics = res.filter(topic => topic.leaderid == userInfo.sub);
        setTopics(userTopics);
      })
      .catch(err => console.log(err));
  }, []);
  // for selecting a specific topic
  const getTopicID = id => {
    setTopicID(id);
  };

  // used when deleting a topic
  const resetTopicID = () => {
    setTopicID(0);
  };

  const viewRequestsList = id => {
    console.log("viewRequestsList called");
    getAllResponses()
      .then(res => {
        let requestInfo = res.filter(req => req.topicid == id);
        setRequests(requestInfo);
        console.log("res", res);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="home">
      <div className="nav">
        <h2 className="logo">Apollo</h2>
        <Button type="primary">Owner</Button>

        <Button type="text" href="/member">
          Member
        </Button>

        <Button type="secondary" onClick={() => authService.logout()}>
          Log Out
        </Button>
      </div>

      <h1>Hi {userInfo.name}, Welcome to Apollo.</h1>

      <NewTopicContainer userInfo={userInfo} />

      <TopicListContext.Provider value={{ topics }}>
        <div className="topics-container">
          <div className="topics-list">
            <h2 className="topics-list-title">Your Topics</h2>
            <TopicsList
              topicID={getTopicID}
              viewRequestsList={viewRequestsList}
            />
          </div>

          <div className="main-topic-container">
            {topicID === 0 ? (
              <h2>Select a topic from the topics list.</h2>
            ) : (
              <MainTopic topicID={topicID} reset={resetTopicID}>
                <RequestsContext.Provider value={{ requestList }}>
                  <div className="requests-container">
                    <div className="requests-list">
                      <h2 className="requests-list-title">
                        Responses made from the topic {topics.name}
                      </h2>
                      <Requests />
                    </div>
                  </div>
                </RequestsContext.Provider>
              </MainTopic>
            )}
          </div>
        </div>
      </TopicListContext.Provider>
      <ResponsesContext.Provider value={{ responseList }}>
        <Responses />
      </ResponsesContext.Provider>
      <ThreadsContext.Provider value={{ threads }}>
        <ThreadsList />
      </ThreadsContext.Provider>
    </div>
  );
}
export default RenderHomePage;
