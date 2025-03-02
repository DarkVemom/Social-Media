import { Box, Container } from "@chakra-ui/react";
import React, { createContext, useState } from "react";
import { Navigate, Route, Router, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import VerifyEmailForm from "./components/VerifyEmailForm";
import LoginCard from "./components/LoginCard";
import SignupCard from "./components/SignupCard";
// import LogoutButton from './components/LogoutButton'
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ResetPasswordForm from "./components/ResetPasswordForm";
import CreatePost from "./components/CreatePost";
// import DemoPostFetch from './pages/DemoPostFetch'
import ChatPage from "./pages/ChatPage";
import { SocketContextProvider } from "./context/SocketContext";
import SettingsPage from "./pages/SettingsPage";
import ParentSettinges from "./pages/ParentSettinges";
import AuthPage from "./pages/AuthPage";
import VerifyEmailFormUser from "./components/VerifyEmailFormUser";
import SearchPage from "./pages/SearchPage";
export const Context = React.createContext();
export const ConversationsContext = React.createContext();
export const SelectedConversationContext = React.createContext();

// export const SocketContext = React.createContext();

const App = () => {
  const user = JSON.parse(localStorage.getItem("user-threads"));
  const [posts, setPosts] = useState([]);
  const [conversation, setConversations] = useState([]);
  const [selectedConversation, setselectedConversation] = useState({
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  });

  const { pathname } = useLocation();

  return (
    <Box position={"relative"} w="full">
      {/* <SocketContextProvider> */}
      <Container
        maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}
      >
        <Context.Provider value={[posts, setPosts]}>
          <ConversationsContext.Provider
            value={[conversation, setConversations]}
          >
            <SelectedConversationContext.Provider
              value={[selectedConversation, setselectedConversation]}
            >
              <Header />
              <Routes>
                <Route
                  path="/"
                  element={user ? <Homepage /> : <Navigate to="/auth" />}
                />
                <Route
                  path="/auth"
                  element={!user ? <LoginCard /> : <Navigate to="/" />}
                />
                <Route
                  path="/auth/signup"
                  element={!user ? <SignupCard /> : <Navigate to="/" />}
                />
                <Route
                  path="/update"
                  element={
                    user ? <UpdateProfilePage /> : <Navigate to="/auth" />
                  }
                />
                <Route
                  path="/:username"
                  element={
                    user ? (
                      <>
                        <UserPage />
                        <CreatePost />
                      </>
                    ) : (
                      <UserPage />
                    )
                  }
                />
                <Route path="/:username/post/:pid" element={<PostPage />} />
                <Route
                  path="/chat"
                  element={user ? <ChatPage /> : <Navigate to="/auth" />}
                />
                
                <Route
                  path="/search"
                  element={user ? <SearchPage /> : <Navigate to="/auth" />}
                />
                <Route
                  path="/settings"
                  element={user ? <ParentSettinges /> : <Navigate to="/auth" />}
                />
                <Route
                  path="/settings/frozeAccount"
                  element={user ? <SettingsPage /> : <Navigate to="/auth" />}
                />
                <Route
                  path="/settings/TwoFactorAuthentaction"
                  element={user ? <AuthPage /> : <Navigate to="/auth" />}
                />
                <Route
                  path="/forgot password"
                  element={<ForgotPasswordForm />}
                />
                <Route
                  path="/auth/VerifyEmailForm"
                  element={<VerifyEmailForm />}
                />
                <Route
                  path="/auth/VerifyEmailForm/2FA"
                  element={<VerifyEmailFormUser />}
                />
                <Route
                  path="/password/reset/:token"
                  element={<ResetPasswordForm />}
                />
                {/* <Route path='/postofuser' element = {<DemoPostFetch/>}/>  */}
              </Routes>
              {/* {user && <LogoutButton/>} */}
              {/* {user && <CreatePost/>} */}
            </SelectedConversationContext.Provider>
          </ConversationsContext.Provider>
        </Context.Provider>
      </Container>
      {/* </SocketContextProvider> */}
    </Box>
  );
};

export default App;
