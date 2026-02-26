import Dashboard from "../components/Dashboard";
import { Page, Main, HeaderContainer, LogoWrapper, StyledTitle } from "./Page.styles";
import ThemeLogo from "../components/ThemeLogo";
import ThemeToggle from "../components/ThemeToggle";
import HomeClickWrapper from "../components/HomeClickWrapper";

export default async function Home() {
  return (
    <Page>
      <Main className="inner">
        <HeaderContainer>
          <HomeClickWrapper>
            <LogoWrapper>
              <ThemeLogo />
            </LogoWrapper>
            <StyledTitle> 핫딜 연구소</StyledTitle>
          </HomeClickWrapper>
          <ThemeToggle />
        </HeaderContainer>
        <Dashboard />
      </Main>
    </Page>
  );
}