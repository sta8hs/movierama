import { Text, TextLink } from '@/components/Text';
import styles from './Footer.module.css';
import Spacer from './Spacer';
import Wrapper from './Wrapper';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Wrapper>
        <Text color="accents-7">
          Made with ❤️ by{' '}
          <TextLink href="https://github.com/sta8is" color="link">
            Stathis Kokmotos
          </TextLink>
          .
        </Text>
        <Spacer size={1} axis="vertical" />
      </Wrapper>
    </footer>
  );
};

export default Footer;
