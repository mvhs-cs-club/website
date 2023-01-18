// mui
import { styled } from '@mui/material/styles';

// components
import PageTitle from 'components/page-title';
import Img from 'components/img';
import FadeIn from 'keyframes/fade-in';
import PageWrapper from 'components/page-wrapper';

// images
import discordIcon from 'assets/discord.webp';

const SocialWrapper = styled('div')({
  height: 40,
  width: 40,
  transition: '0.25s',
  '&:hover': {
    transform: 'scale(1.2)'
  }
});

const P = styled('p')(({ theme }) => ({
  fontSize: '17px',
  color: theme.palette.getContrastText(theme.palette.background.default)
}));

interface SocialLinkProps {
  children: React.ReactNode;
  to: string;
}

const SocialLink = ({ children, to }: SocialLinkProps) => {
  return (
    <a href={to}>
      <FadeIn>
        <SocialWrapper>{children}</SocialWrapper>
      </FadeIn>
    </a>
  );
};

const About = () => {
  const discordLink = 'https://discord.gg/JZqHZkqkDZ';

  const imgSx = {
    height: '100%',
    width: '100%',
    borderRadius: '100%',
    overflow: 'hidden'
  };

  return (
    <PageWrapper>
      <PageTitle>About</PageTitle>
      <P>
        The MVHS CS Club is a student-run organization that aims to provide a welcoming environment for
        students to learn and develop their skills in computer science.
      </P>
      <P>We host events throughout the school year such as hackathons, app competitions, and more.</P>
      <SocialLink to={discordLink}>
        <Img
          src={discordIcon}
          sx={imgSx}
          refer-policy="noreferrer"
        />
      </SocialLink>
    </PageWrapper>
  );
};

export default About;
