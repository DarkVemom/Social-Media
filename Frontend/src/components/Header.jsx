import React from "react";
import {
  Flex,
  Image,
  useColorMode,
  Button,
  Link,
  Stack,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { SearchIcon } from "@chakra-ui/icons";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = JSON.parse(localStorage.getItem("user-threads"));
  const logout = useLogout();
  return (
    <Flex justifyContent={"space-between"} mt={"6"} mb={"12"}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"} /*onClick={() => setAuthScreen("login")}*/
        >
          Login
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={"6"}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/search`}>
            <SearchIcon cursor={"pointer"} />
          </Link>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>
          <Link as={RouterLink} to={`/settings`}>
            <MdOutlineSettings size={20} />
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={"/auth/signup"} /*onClick={() => setAuthScreen("signup")}*/
        >
          Sign up
        </Link>
      )}
    </Flex>
  );
};

export default Header;
