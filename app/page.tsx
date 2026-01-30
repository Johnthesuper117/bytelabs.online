import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <script defer src="/assets/js/dynamicTitle.js"></script>
      <h1>ByteLabs Online</h1>
      <Navbar />
      <div className="content">
        <p>
          Welcome! This is my website which I use to post fun, random, stuff like projects or games I make, school projects, all that.
          <br />
          <br />
          So take a look around, admire my work, mess with people using the soundboard, play my mid scratch game, complement my effort and ideas, criticize me, tell me how you could have done better in every way possible, send a suggestion and review, whatever. Just try to have fun!
        </p>
      </div>
      <Footer />
    </>
  );
}
